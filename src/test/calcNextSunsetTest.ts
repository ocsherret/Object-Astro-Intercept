import { SunAstroTimes } from "../sunastrotimes"
import { expect } from 'chai';

describe("#calcNextSunsetTime()", () => {
    function runTest(time: string, latitude: number, longitude: number, altitude: number, expected: string) {
        const timeNum = new Date(time).getTime();
        const expectedNum = new Date(expected).getTime();
        const sun = new SunAstroTimes(timeNum, latitude, longitude, altitude);
        const actual = sun.calcNextSunset(timeNum, latitude, longitude, altitude);
        const difference = Math.abs(sun.getNextSunset() - expectedNum);
        if (difference > 1000) {
            expect.fail(`Actual ${actual}. Expected ${expected}.`);
        }
    }
    it("should return the correct time for a location", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, 170, 252, "2020-04-04 07:12:07Z");
    });
    it("should return the correct time for a location", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, -170, 252, "2020-04-04 05:52:03Z");
    });
    it("should return the correct time for a location", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, -85, 252, "2020-04-04 00:11:45Z");
    });
    it("should return the correct time for a location", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, 85, 252, "2020-04-03 12:51:09Z");
    });
    it("should return the correct time for a location", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, 105, 252, "2020-04-04 11:32:20Z");
    });
});