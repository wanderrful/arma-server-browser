"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Steam = require("steam-gameserver");
;
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
function fn_db_initMasterTable() {
    fn_debug();
}
exports.fn_db_initMasterTable = fn_db_initMasterTable;
/// Steam-gameserver Functions
function fn_refreshServerList() {
    let ServerList;
    const app_id = 107410;
    // Only the app_id games, no empty servers
    const filter = `\\appid\\${app_id}\\empty\\1`;
    let steam = new Steam();
    // Pretend to be a dummy TF2 server so that we can perform the server query
    steam.logOn({
        "appID": 440,
        "gameDirectory": "tf",
        "gameVersion": "3561198"
    });
    steam.on("loggedOn", () => {
        fn_log("Logged into Steam.  Fetching server list...");
        steam.getServerList(filter, 1, (res) => {
            console.log(res[0]);
            fn_log(`${res.length} server(s) found.`);
            // Parse Steam server info into the data I want
            ServerList = res.map(fn_parseServerData);
            fn_log("Server query complete.  Logging off.");
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