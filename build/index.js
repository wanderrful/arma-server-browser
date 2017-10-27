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
    app.set("port", Number(process.env.PORT) || 8000);
    app.set("views", "./views");
    app.set("view engine", "pug");
    //Define the server routes
    app.use("/", (req, res) => {
        res.render("index", {
            title: "hello",
            message: "world!",
            server_list: JSON.stringify(lib.server_data)
        }, (err, html) => {
            if (err) {
                lib.fn_log("ERROR: failed to render index\n" + err.message);
            }
            else {
                res.send(html);
            }
        });
    });
    // Actually start the server
    http.createServer(app).listen(app.get("port"), () => {
        lib.fn_log("EXPRESS SERVER RUNNING");
        // Begin refreshing the server list every REFRESH_RATE minutes
        setInterval(lib.fn_refreshServerList, Number(process.env.REFRESH_RATE) * 60 * 1000);
    });
}
/// Run the web app
main();
//# sourceMappingURL=index.js.map