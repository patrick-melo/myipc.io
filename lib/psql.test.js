//const pg = require("pg");
const { Client } = require("pg");
const psql = require("./psql");

describe("psql tests", () => {
   
    test('ipcdb_connect', async () => {
        
        const client = new Client(process.env.DATABASE_URL);
        expect(client).toBeTruthy();

        await client.connect();
        try {
            let query = "SELECT NOW()";
            let results = await client.query("SELECT NOW()");
            //console.log(results);
        } catch (err) {
            console.log("error executing query:", err);
        } finally {
            client.end();
        }
    
    });
});