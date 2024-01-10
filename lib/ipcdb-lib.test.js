
const IPCDBLib = require("./ipcdb-lib.js");

describe("ipcdb-lib tests", () => {
   
    test('ipcdb_connect', async () => {
        
        let session = await IPCDBLib.ipcdb_connect();
        expect(session).toBeTruthy();

        let client = session.client;
        expect(client).toBeTruthy();
        
        let query = "SELECT * FROM ipc_list WHERE token_id=1";
        let rows =  await client
            .query({ text: query, rowMode: "array" })
            .then(res => res.rows)
            .catch(err => null);

        //console.log(rows);
        expect(rows).toBeTruthy();;
        
        client.release();
        await session.pool.end();
    });
})
