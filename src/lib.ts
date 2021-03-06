import * as Steam from "steam-gameserver";
import * as pg from "pg";



// Initialize the reference to the PostgreSQL server
const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL || `postgresql://localhost:5432/temp_app?user=postgres&password=${process.env.DB_PASSWORD}`
});
pgClient.on("notification", (message) => { fn_log("DB NOTICE: " + message.payload); });
pgClient.on("error", (err) => { fn_log("DB ERROR: " + err.message); });

// Define the name of the table that the web app will use for storing server data
const MasterTableName: string = "db_masterserverlist";

// Define the end point for the front-end to get all stored server data
export let server_data: Array<ISteamServer>;



/// Interfaces
interface ISteamServer {
    name: string,
    addr: string,
    gameport: number,
    map: string,
    players: number,
    max_players: number,
};
interface ISteamServerQueryResponse extends ISteamServer {
    // A @types/steam-gameserver package does not exist, so
    // I am manually defining this to appease the TypeScript compiler
    specport: number,
    steamid: object,
    gamedir: string,
    version: string,
    product: string,
    region: number,
    bots: number,
    secure: boolean,
    dedicated: boolean,
    os: string,
    gametype: string
}



/// Utility Functions
export function fn_debug(text?: string): void {
    throw `Not yet implemented! ${text}`;
}
export function fn_log(text: string): void {
    console.log("***", text);
}



/// Database Functions
export function fn_db_login(): void {
    pgClient.connect( (err) => {
        if (err) {
            fn_log("DB CONNECTION ERROR");
            
            process.exit();
        } else {
            fn_log("DB CONNECTED");

            fn_db_initMasterTable(pgClient);
            fn_refreshServerList();
        }
    });
}
// Initialize the master table, if it does not already exist
function fn_db_initMasterTable(client: pg.Client): void {
    client.query({
        text: `CREATE TABLE IF NOT EXISTS ${MasterTableName} (server_data jsonb not null)`
    }, (err, res) => {
        if (err) fn_log("DB: master table failed to create!\n" + err.message);
    });
}
// Write new data to the master table
function fn_db_writeToMasterTable(data: Array<ISteamServer>): void {
    data.forEach( (server) => {
        pgClient.query({
            text: `INSERT INTO ${MasterTableName} VALUES ('${JSON.stringify(server)}'::jsonb)`
        }, (err, res) => {
            if (err) fn_log("DB: failed to write to master table!\n" + err.message);
        });
    });
}
// Wipe the master table of all server data
function fn_db_wipeMasterTableContents(): void {
    pgClient.query({
        text: `DELETE FROM ${MasterTableName}`
    }, (err, res) => {
        if (err) fn_log("DB: failed to wipe the master table!\n" + err.message);
    });
}
function fn_db_getMasterTableContents(): void {
    pgClient.query({
        text: `SELECT * FROM ${MasterTableName}`
    }, (err, res) => {
        if (err) fn_log("DB: failed to wipe the master table!\n" + err.message);

        // TODO: figure out how to communicate the data content to the front-end from here!
        // (because it's wrong to store it all in a variable for the front-end to reference)
    });
}



/// Steam-gameserver Functions
export function fn_refreshServerList(given_app_id?: number): void {
    // //This web app was made for Arma, so assume that by default, unless specified
    const app_id: number = given_app_id || 107410;

    // Only the app_id games, no empty servers
    const filter: string = `\\appid\\${app_id}\\empty\\1`;

    const steam = new Steam();

    // Pretend to be a dummy TF2 server so that we can perform the server query
    steam.logOn({
        "appID": 440,
        "gameDirectory": "tf",
        "gameVersion": "3561198"
    });

    steam.on("loggedOn", () => {
        fn_log("Logged into Steam.  Fetching server list...");
        steam.getServerList(filter, 10, (res: Array<ISteamServerQueryResponse>) => {
            if (!res.length) {
                fn_log("ERROR retrieving server data! Logging off.")
            } else {
                fn_log(`${res.length} server(s) found.`);

                // Parse Steam server info into the data I want
                let servers: Array<ISteamServer> = res.map(fn_parseServerData);
                server_data = servers;

                fn_log("Server query complete.  Logging off.")

                // Wipe the server list table and replace it with the new server data
                fn_db_wipeMasterTableContents();
                fn_db_writeToMasterTable(servers);
            }
            steam.logOff();
        });
    });
}

// Convert a Steam server query response into the data object format that I need
function fn_parseServerData(data: ISteamServerQueryResponse): ISteamServer {
    return {
        name: data.name,
        addr: data.addr,
        gameport: data.gameport,
        map: data.map,
        players: data.players,
        max_players: data.max_players
    };
}