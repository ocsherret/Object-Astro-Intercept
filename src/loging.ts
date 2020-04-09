import * as fs from 'fs';
import * as os from 'os';


export function log(data: string) {
    data = `${os.EOL}${new Date().toUTCString()}:  ${data}`;
    fs.appendFile("Sun-Astro-Intercept.log", data, "utf8", (err: any) => {
        if (err) throw err;
        console.log("Data has been added to the log");
    });
};
