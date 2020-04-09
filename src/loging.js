const fs = require("fs");
const os = require("os");

module.exports.log = function(data) {
    data = `${os.EOL}${new Date().toUTCString()}:  ${data}`;
    fs.appendFile("Sun-Astro-Intercept.log", data, "utf8", (err) => {
        if (err) throw err;
        console.log("Data has been added to the log");
    });
};
