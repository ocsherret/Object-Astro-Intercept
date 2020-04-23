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
    it("#checkForIntercept: Toronto on 2020-04-17 @ 2:07Z", () => {
        runTest(90, 43, -79, 20000, 600, "2020-04-17 02:07:51Z", false, "2020-04-17 06:52:10Z");
    });
    it("#checkForIntercept: Toronto on 2020-04-17 @ 2:07Z", () => {
        runTest(90, 44, -89, 0, 313, "2020-04-21 22:08:25Z", true, "2020-04-21 23:54:39Z");
    });
    it("#checkForIntercept: Toronto on 2020-04-17 @ 2:07Z", () => {
        runTest(90, 44, -93, 0, 313, "2020-04-21 22:08:25Z", true, "2020-04-21 23:54:39Z");
    });
})

