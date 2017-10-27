import * as http from "http";
import * as https from "https";
import * as Express from "express";
import * as pg from "pg";

import * as lib from "./lib";


function main() {
    // Initialize the web app as an Express server
    const app = Express();
    
    // Connect to the Postgres database
    lib.fn_db_login();
    
    
    // Configure the server
    const server_config: lib.IWebServerConfig = {
        port: Number(process.env.PORT) || 8000
    };



    //Define the server routes
    app.get("/1", (req, res) => {
        res.send("Hello world!");
    });
    app.get("/2", (req, res) => {
        res.send("Hello world!");
    });


    
    // Actually start the server
    http.createServer(app).listen(server_config.port, () => {
        lib.fn_log("EXPRESS SERVER RUNNING");

        lib.fn_log("Attempting to begin setInterval...");
        setInterval(lib.fn_refreshServerList, 5 * 60 * 1000);
    });
}



/// Run the web app
main();