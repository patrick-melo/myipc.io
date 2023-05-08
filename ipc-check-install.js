const fs = require('fs').promises;
const IPCDBLib = require("./lib/ipcdb-lib.js");
const IPCGif = require("./lib/ipc-gif.js");
const IPCCard = require("./lib/ipc-card.js");

const GIF_DIR = "react/build/sprites/";
const CARD_DIR = "react/build/cards/";

const start = async function()
{
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
        filenameGIF = await fs.access(GIF_DIR + filenameGIF + ".gif").then(res => filenameGIF).catch(err => "");
        
        //check for cards
        let filenameCard = ipc_id; 
        filenameCard = await fs.access(CARD_DIR + filenameCard + ".jpg").then(res => filenameCard).catch(err => "");   
        
        if (filenameGIF == "" || filenameCard == "")
        {

            query = "SELECT * FROM ipc_list WHERE token_id = " +ipc_in_db[id];

            let ipc_row =  await client.query({ text: query, rowMode: "array" }).then(res => res.rows).catch(err => null);
            if(ipc_row == null)
            {
                console.log("IPC_DB_ERROR");
                process.exit();
            }
        
            let ipc = IPCDBLib.ipcdb_array_to_ipc(ipc_row[0]);

            if(filenameGIF == "")
            {
                //Generate ipc gif
                let result = await IPCGif.ipcgif_store(ipc);
                if(result == "")
                {
                    console.log("ERROR GENERATING " +GIF_DIR+result+".gif");
                    process.exit();
                }
                else
                {
                    console.log("GENERATED : " +result +".gif");
                }
            }

            if (filenameCard == "")
            {
                //generate ipc card
                let result = await IPCCard.ipccard_store(ipc);
                if(result == "")
                {
                    console.log("ERROR GENERATING " +CARD_DIR+result+".jpg");
                    process.exit();
                }
                else
                {
                    console.log("GENERATED : " +result +".jpg");
                }
                
            }

        }

        

    }

    //console.log(rows);
    process.exit();
}

start();

