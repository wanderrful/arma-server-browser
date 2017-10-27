import * as http from "http";
import * as https from "https";
import * as Express from "express";

import * as lib from "./lib";


function main() {
    const app = Express();
    
    const server_config: lib.IServerConfig = {
        port: Number(process.env.PORT) || 8000
    };



    http.createServer(app).listen(server_config.port);
}



main();