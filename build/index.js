"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Express = require("express");
function main() {
    const app = Express();
    const server_config = {
        port: Number(process.env.PORT) || 8000
    };
    http.createServer(app).listen(server_config.port);
}
main();
//# sourceMappingURL=index.js.map