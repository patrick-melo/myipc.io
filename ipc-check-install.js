const fsA = require('fs').promises;
const fs = require('fs');
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

    //for (let id in ipc_in_db) 
    {
        //check for sprites
        let filenameGIF = ipc_in_db[0]; 
        filenameGIF = await fsA.access("react/build/sprites/" + filenameGIF + ".gif").then(res => filenameGIF).catch(err => "");

        console.error( ipc_in_db[0] +" : "+ filenameGIF);

        try 
        {
            if (fs.existsSync("react/build/sprites/" + filenameGIF + ".gif"))
            {
                //file exists
                console.log("Exists -> IPC gif: " +filenameGIF);
            }
            else
            {
                console.log("Absent -> IPC gif: " +filenameGIF);
            }
        } 
        catch(err) 
        {
            console.log("Error -> IPC gif: " +filenameGIF);
            console.error(err);

        }


        
        
        //check for cards
        //let filenameCard = id; 
        //filenameCard = await fs.access(IPCCard.IPCCARD_DIR + filenameCard + ".jpg")
        //    .then(res => filenameCard).catch(err => "");
        
        //if (filenameGIF == "" || filenameCard == "")
        {
            //let ipc = await IPCDBLib.ipcdb_select_ipc(session, id);
            
            //if(filenameGIF == "" && ipc != null)
            {
                //Generate ipc gif
                //console.log(" Generating IPC gif: " +id);
                //await IPCGif.ipcgif_store(ipc);
            }

            //if (filenameCard == "" && ipc != null)
            {
                //generate ipc card
                //console.log("Generating IPC card: " +id);
                //await IPCCard.ipccard_store(ipc);
            }
        }

    }

    //console.log(rows);
}

start();

