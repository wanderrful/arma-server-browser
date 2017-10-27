"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Express = require("express");
const lib = require("./lib");
function main() {
    // Initialize the web app as an Express server
    const app = Express();
    // Connect to the Postgres database
    lib.fn_db_login();
    // Configure the server
    const server_config = {
        port: Number(process.env.PORT) || 8000
    };
    //Define the server routes
    //
    // Actually start the server
    http.createServer(app).listen(server_config.port);
}
/// Run the web app
main();
//# sourceMappingURL=index.js.map