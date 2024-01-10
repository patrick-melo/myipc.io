const pg = require("pg");
const psql = require("./psql");

describe("ipcdb-lib tests", () => {
   
    test('ipcdb_connect', async () => {
        let database_url = process.env.DATABASE_URL;

        const config = psql.psql_create_config(database_url);
        
        const client = new pg.Client(config);
        expect(client).toBeTruthy();

        client.connect();

        let query = "SELECT VERSION()";
        let rows = await client
            .query({text: query, rowMode: "array"})
            .then(res => res.rows)
            .catch(err => null);
        
        //console.log(rows);

        client.end();
    });
});