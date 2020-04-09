import { checkForIntercept } from "../index.js"
import { expect } from "chai";
//const expect = require("chai").expect;

describe("#checkForIntercept", () => {
    
    function runTest(
        objTrueBearing: number, 
        objLatitude: number, 
        objLongitude: number, 
        objAltitude: number, 
        objSpeed: number, 
        timeNow: string, 
        daytime: boolean, 
        expectedDate: string){
        
        const timeNum = new Date(timeNow).getTime();
        const expected = new Date(expectedDate).getTime();
        const actual = checkForIntercept(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNum, daytime)
        const difference = Math.abs(actual.timeToPoint - expected)
        if(difference > 1000){
            expect.fail(`Actual ${new Date(actual.timeToPoint).toUTCString()}. Expected ${new Date(expected).toUTCString()}.`);
        }
    }
    it("#checkForIntercept", () => {
                runTest(75, 45, -79, 30000, 600, "2020-04-04 20:24:13Z", true, "2020-04-04 22:18:45Z");
    });
})

