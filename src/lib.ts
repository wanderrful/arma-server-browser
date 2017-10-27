import * as Steam from "steam-gameserver";
import * as pg from "pg";



/// Interfaces
export interface IWebServerConfig {
    port: number
};
interface ISteamServer {
    name: string,
    addr: string,
    gameport: number,
    map: string,
    players: number,
    max_players: number,
};
// A @types/steam-gameserver does not exist, so I'm manually defining this to appease the TypeScript compiler
interface ISteamServerQueryResponse extends ISteamServer {
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
export function fn_db_initMasterTable(): void {
    fn_debug();
}


/// Steam-gameserver Functions
export function fn_refreshServerList(): void {
    let ServerList: Array<ISteamServer>;

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
        fn_log("Logged into Steam.  Fetching server list...")
        steam.getServerList(filter, 1, (res: Array<ISteamServerQueryResponse>) => {
            console.log(res[0]);

            fn_log(`${res.length} server(s) found.`);

            // Parse Steam server info into the data I want
            ServerList = res.map(fn_parseServerData);

            fn_log("Server query complete.  Logging off.")
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