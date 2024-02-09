//const pg = require("pg");
const { Client } = require("pg");
const psql = require("./psql");

describe("psql tests", () => {
   
    test('ipcdb_connect', async () => {
        console.log("Create client.");
        const client = new Client(process.env.DATABASE_URL);
        console.log("Create client complete.");
        expect(client).toBeTruthy();

        (async () => {
            await client.connect();
            try {
                let query = "SELECT NOW()";
                let rows = await client
                    .query({text: query, rowMode: "array"})
                    .then(res => res.rows)
                    .catch(err => null);
            } catch (err) {
                console.error("error executing query:", err);
            } finally {
                client.end();
            }
        })();
    });
});