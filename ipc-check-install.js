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
        
            let ipc = IPCDBLib.ipcdb_array_to_ipc(ipc_row);

            console.log(ipc_row[0]);
            console.log(ipc_row[1]);

            /*
            console.log(ipc.name);
            console.log(ipc.attribute_seed);
            console.log(ipc.dna);
            console.log(ipc.birth);
            console.log(ipc.price);
            console.log(ipc.gold);
            console.log(ipc.xp);
            console.log(ipc.owner);
            console.log(ipc.race);
            console.log(ipc.subrace);
            console.log(ipc.gender);
            console.log(ipc.height);
            console.log(ipc.skin_color);
            console.log(ipc.hair_color);
            console.log(ipc.eye_color);
            console.log(ipc.handedness);
            console.log(ipc.strength);
            console.log(ipc.force);
            console.log(ipc.sustain);
            console.log(ipc.tolerance);
            console.log(ipc.dexterity);
            console.log(ipc.speed);
            console.log(ipc.precision);
            console.log(ipc.reaction);
            console.log(ipc.intelligence);
            console.log(ipc.memory);
            console.log(ipc.processing);
            console.log(ipc.reasoning);
            console.log(ipc.intelligence);
            console.log(ipc.intelligence);



            
            
            ipc.id = parseInt(rows[0]);
            ipc.token_id = parseInt(rows[1]);
            ipc.name = rows[2];

            ipc.attribute_seed = rows[3];
            ipc.dna = rows[4];
            ipc.birth = parseInt(rows[5]);

            ipc.price = parseInt(rows[6]);
            ipc.gold = parseInt(rows[7]);
            ipc.xp = parseInt(rows[8]);
            ipc.owner = rows[9];
            // FIX
            ipc.race = rows[10];
            ipc.subrace = rows[11];
            ipc.gender = rows[12];
            ipc.height = rows[13];
            // FIX
            ipc.skin_color = rows[14];
            ipc.hair_color = rows[15];
            ipc.eye_color = rows[16];
            ipc.handedness = rows[17];

            ipc.strength = rows[18];
            ipc.force = rows[19];
            ipc.sustain = rows[20];
            ipc.tolerance = rows[21];

            ipc.dexterity = rows[22];
            ipc.speed = rows[23];
            ipc.precision = rows[24];
            ipc.reaction = rows[25];

            ipc.intelligence = rows[26];
            ipc.memory = rows[27];
            ipc.processing = rows[28];
            ipc.reasoning = rows[29];

            ipc.constitution = rows[30];
            ipc.healing = rows[31];
            ipc.fortitude = rows[32];
            ipc.vitality = rows[33];

            ipc.luck = rows[34];
            ipc.accessories = parseInt(rows[35]);
            ipc.last_updated = parseInt(rows[36]);

            try { ipc.meta = JSON.parse(rows[37]); }
            catch (err) { ipc.meta = ""; }  
            
            */

            if(filenameGIF == "" && ipc_row != null)
            {
                //Generate ipc gif
                console.log("Generating IPC gif: " +ipc.token_id);
                let result = await IPCGif.ipcgif_store(ipc);
                console.log("Generated IPC gif: " +result);
            }

            if (filenameCard == "" && ipc_row != null)
            {
                //generate ipc card
                console.log("Generating IPC card: " +ipc_id);
                let result = await IPCCard.ipccard_store(ipc);
                console.log("Generated IPC card: " +result);
            }

            console.log("--------------------");
        }

        

    }

    //console.log(rows);
    process.exit();
}

start();

