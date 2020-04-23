import { calculateProjectedLatLong } from "../index";
import { expect } from "chai";

describe("#calculateProjectedLatLong", () =>{
    function runTest(
        distanceToPoint: number, 
        timeToPoint: string, 
        objTrueBearing: number, 
        objLatitude: number, 
        objLongitude: number, 
        objAltitude: number, 
        timeNow: string, 
        daytime: boolean, 
        expected: string){



        const timeToPointNum = new Date(timeToPoint).getTime();
        const expectedTime = new Date(expected).getTime();
        const timeNum = new Date(timeNow).getTime();
        const actual = calculateProjectedLatLong(distanceToPoint, timeToPointNum, objTrueBearing, objLatitude, objLongitude, objAltitude,timeNum, daytime);
        const difference = Math.abs(actual.nextSunTime - expectedTime);
        if (difference > 1000) {
            expect.fail(`Actual ${new Date(actual.nextSunTime).toUTCString()}. Expected ${expected}.`);
        }
        
    };
    it("should return the next Sunset 300NM east from 45N 20.5W if standing there at 2020-04-03 18:13Z", () => {
        
        runTest(300, "2020-04-03 18:13:00Z", 75, 45, 20.5, 30000, "2020-04-03 17:50:00Z", true, "2020-04-04 17:01:31Z");
    });
    it("should return the next Sunrise 300NM east 20.5W if standing there at 2020-04-03 18:13Z", () => {
        
        runTest(300, "2020-04-03 18:13:00Z", 75, 45, 20.5, 30000,"2020-04-03 17:50:00Z", false, "2020-04-04 03:24:13Z");
    });
    it("should return the next Sunrise 2000NM east 154E if standing there at 2020-04-19 03:36Z", () => {
        
        runTest(2000, "2020-04-19 03:36:00Z", 90, 40, 154, 20000,"2020-04-03 17:50:00Z", true, "2020-04-20 05:47:19Z");
    });
    it("should return the next Sunrise 2000NM east 154E if standing there at 2020-04-19 03:36Z", () => {
        
        runTest(2000, "2020-04-19 03:36:00Z", 90, 40, 154, 20000,"2020-04-03 17:50:00Z", false, "2020-04-19 16:13:11Z");
    });
    
})