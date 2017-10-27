import * as Steam from "steam-gameserver";



/// Interfaces
export interface IServerConfig {
    port: number
}



/// Functions
export function fn_debug(): void {
    throw "Not yet implemented!";
}



/// Database Functions



/// Steam-gameserver Functions
export function fn_getServers(): void {
    const app_id: number = 107410;

    // Only the app_id games, no empty servers
    const filter: string = `\\appid\\${app_id}\\empty\\1`;

    let steam = new Steam();
    steam.getServerList(filter, 10, (servers) => {
        console.log(servers);
    });
}