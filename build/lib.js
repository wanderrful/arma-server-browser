"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Steam = require("steam-gameserver");
const pg = require("pg");
// Initialize the reference to the PostgreSQL server
const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL || `postgresql://localhost:5432/temp_app?user=postgres&password=${process.env.DB_PASSWORD}`
});
pgClient.on("notification", (message) => { fn_log("DB NOTICE: " + message.payload); });
pgClient.on("error", (err) => { fn_log("DB ERROR: " + err.message); });
// Define the name of the table that the web app will use for storing server data
const MasterTableName = "db_masterserverlist";
;
/// Utility Functions
function fn_debug(text) {
    throw `Not yet implemented! ${text}`;
}
exports.fn_debug = fn_debug;
function fn_log(text) {
    console.log("***", text);
}
exports.fn_log = fn_log;
/// Database Functions
function fn_db_login() {
    pgClient.connect((err) => {
        if (err) {
            fn_log("DB CONNECTION ERROR");
            process.exit();
        }
        else {
            fn_log("DB CONNECTED");
            fn_db_initMasterTable(pgClient);
            fn_refreshServerList();
        }
    });
}
exports.fn_db_login = fn_db_login;
// Initialize the master table, if it does not already exist
function fn_db_initMasterTable(client) {
    client.query({
        text: `CREATE TABLE IF NOT EXISTS ${MasterTableName} (server_data jsonb not null)`
    }, (err, res) => {
        if (err)
            fn_log("DB: master table failed to create!\n" + err.stack);
    });
}
// Write new data to the master table
function fn_db_writeToMasterTable(data) {
    data.forEach((server) => {
        pgClient.query({
            text: `INSERT INTO ${MasterTableName} VALUES ('${JSON.stringify(server)}'::jsonb)`
        }, (err, res) => {
            if (err)
                fn_log("DB: failed to write to master table!\n" + err.message);
        });
    });
}
// Wipe the master table of all server data
function fn_db_wipeMasterTableContents() {
    pgClient.query({
        text: `DELETE FROM ${MasterTableName}`
    }, (err, res) => {
        if (err)
            fn_log("DB: failed to wipe the master table!\n" + err.message);
    });
}
// Read server data from the master table into JSON
function fn_db_getServerData() {
    let servers;
    pgClient.query({
        text: `SELECT * FROM ${MasterTableName}`
    }, (err, res) => {
        if (err)
            fn_log("DB: failed to wipe the master table!\n" + err.message);
        if (res.rows.length) {
            res.rows.forEach((server) => {
                servers.push(server);
            });
        }
    });
    return servers;
}
exports.fn_db_getServerData = fn_db_getServerData;
/// Steam-gameserver Functions
function fn_refreshServerList(given_app_id) {
    let ServerList;
    // //This web app was made for Arma, so assume that by default, unless specified
    const app_id = given_app_id || 107410;
    // Only the app_id games, no empty servers
    const filter = `\\appid\\${app_id}\\empty\\1`;
    const steam = new Steam();
    // Pretend to be a dummy TF2 server so that we can perform the server query
    steam.logOn({
        "appID": 440,
        "gameDirectory": "tf",
        "gameVersion": "3561198"
    });
    steam.on("loggedOn", () => {
        fn_log("Logged into Steam.  Fetching server list...");
        steam.getServerList(filter, 10, (res) => {
            if (!res.length) {
                fn_log("ERROR retrieving server data! Logging off.");
            }
            else {
                fn_log(`${res.length} server(s) found.`);
                // Parse Steam server info into the data I want
                ServerList = res.map(fn_parseServerData);
                fn_log("Server query complete.  Logging off.");
                // Wipe the server list table and replace it with the new server data
                fn_db_wipeMasterTableContents();
                fn_db_writeToMasterTable(ServerList);
            }
            steam.logOff();
        });
    });
}
exports.fn_refreshServerList = fn_refreshServerList;
// Convert a Steam server query response into the data object format that I need
function fn_parseServerData(data) {
    return {
        name: data.name,
        addr: data.addr,
        gameport: data.gameport,
        map: data.map,
        players: data.players,
        max_players: data.max_players
    };
}
//# sourceMappingURL=lib.js.map