"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var os = __importStar(require("os"));
function log(data) {
    data = "" + os.EOL + new Date().toUTCString() + ":  " + data;
    fs.appendFile("Sun-Astro-Intercept.log", data, "utf8", function (err) {
        if (err)
            throw err;
        console.log("Data has been added to the log");
    });
}
exports.log = log;
;
