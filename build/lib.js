"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Steam = require("steam-gameserver");
;
;
/// Functions
function fn_debug() {
    throw "Not yet implemented!";
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
function fn_getServers() {
    fn_log("Enter fn_getServers()");
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
        fn_log("Logged into " + steam.steamID.steam3());
        steam.getServerList(filter, 2, (res) => {
            if (!res.length) {
                fn_log("NO SERVERS FOUND");
            }
            else {
                fn_log("Server list:");
                console.log(res.length);
                fn_log("End server list");
            }
            fn_log("Server query complete.  Logging off.");
            steam.logOff();
        });
    });
}
exports.fn_getServers = fn_getServers;
//# sourceMappingURL=lib.js.map