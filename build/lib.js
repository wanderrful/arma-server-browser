"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Steam = require("steam-gameserver");
/// Functions
function fn_debug() {
    throw "Not yet implemented!";
}
exports.fn_debug = fn_debug;
/// Database Functions
/// Steam-gameserver Functions
function fn_getServers() {
    const app_id = 107410;
    // Only the app_id games, no empty servers
    const filter = `\\appid\\${app_id}\\empty\\1`;
    let steam = new Steam();
    steam.getServerList(filter, 10, (servers) => {
        console.log(servers);
    });
}
exports.fn_getServers = fn_getServers;
//# sourceMappingURL=lib.js.map