import * as Steam from "steam-gameserver";
import * as pg from "pg";



/// Interfaces
export interface IWebServerConfig {
    port: number
};
interface ISteamServer {
    addr: string,
    port: number,
    name: string,
    players: number,
    max_players: number,
    map: string
};



/// Functions
export function fn_debug(text?: string): void {
    throw `Not yet implemented! ${text}`;
}
export function fn_log(text: string): void {
    console.log("***", text);
}



/// Database Functions
export function fn_db_initMasterTable(): void {
    fn_debug();
}


/// Steam-gameserver Functions
export function fn_getServers(): Array<ISteamServer> {
    fn_log("Enter fn_getServers()");
    let listOfServers: Array<ISteamServer>;

    const app_id: number = 107410;

    // Only the app_id games, no empty servers
    const filter: string = `\\appid\\${app_id}\\empty\\1`;

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
                fn_log("ERROR: NO SERVERS FOUND");
            } else {
                fn_log("Server list:");
                console.log(res.length);
                fn_log("End server list");
            }

            fn_log("Server query complete.  Logging off.")
            steam.logOff();
        });
    });

    if (!listOfServers.length) {
        fn_debug("NO SERVERS FOUND");
    }

    return listOfServers;
}