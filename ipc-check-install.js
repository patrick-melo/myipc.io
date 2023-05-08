const fs = require('fs').promises;

const IPCDBLib = require("./lib/ipcdb-lib.js");
const IPCGif = require("./lib/ipc-gif.js");
const IPCCard = require("./lib/ipc-card.js");

const start = async function(){
    let session = await IPCDBLib.ipcdb_connect();
    if (session == null)
    {
        console.log("IPCDB_RESTOREDB_FAILED_1");
        IPCDBLib.ipcdb_error("IPCDB_RESTOREDB_FAILED");

        process.exit();
        return IPCDB_ERROR;
    }

    let client = session.client;
    let query = "SELECT token_id FROM ipc_list"

    let rows =  await client.query(
        { text: query, rowMode: "array" })
        .then(res => res.rows)
        .catch(err => null);

    if (rows == null)
    {
        IPCDBLib.ipcdb_error("IPCDB_DBIPCLIST_ERROR");
        return null;
    }

    ipc_in_db = rows;

    for (let id in ipc_in_db) 
    {
        let ipc_id = ipc_in_db[id];

        //check for sprites
        let filenameGIF = ipc_id; 
        filenameGIF = await fs.access("react/build/sprites/" + filenameGIF + ".gif").then(res => filenameGIF).catch(err => "");
        
        //check for cards
        let filenameCard = ipc_id; 
        filenameCard = await fs.access("react/build/cards/" + filenameCard + ".jpg").then(res => filenameCard).catch(err => "");   
        
        if (filenameGIF == "" || filenameCard == "")
        {
            console.log("IPC : " +ipc_in_db[id]);

            //let ipc = await IPCDBLib.ipcdb_select_ipc(session, ipc_id);
            query = "SELECT * FROM ipc_list WHERE token_id = " +ipc_in_db[id];

            let ipc_row =  await client.query(
                { text: query, rowMode: "array" })
                .then(res => res.rows)
                .catch(err => null);
        
            console.log("ipc db : " +ipc_row);


            if(filenameGIF == "" && ipc_row != null)
            {
                //Generate ipc gif
                console.log("Generating IPC gif: " +ipc_id);
                await IPCGif.ipcgif_store(ipc_row);
            }

            if (filenameCard == "" && ipc_row != null)
            {
                //generate ipc card
                console.log("Generating IPC card: " +ipc_id);
                ipc_row.meta["sprite"] = ipc_id;
                await IPCCard.ipccard_store(ipc_row);
            }

            console.log("--------------------");
        }

        

    }

    //console.log(rows);
    process.exit();
}

start();

