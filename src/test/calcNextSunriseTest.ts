import { SunAstroTimes } from "../sunastrotimes"
import { expect } from 'chai';

describe("#calcNextSunriseTime()", () => {
    function runTest(time:string, latitude: number, longitude: number, altitude: number, expected: string) {
        const timeNum = new Date(time).getTime();
        const expectedNum = new Date(expected).getTime();

        const actual = new SunAstroTimes(timeNum, latitude, longitude, altitude);
        const difference = Math.abs(actual.getNextSunrise() - expectedNum);

        if (difference > 1000) {
            expect.fail(`Actual ${actual}. Expected ${expected}.`);
        }
    }
    it("should return the correct time for a location 170 long", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, 170, 252, "2020-04-03 18:13:35Z");
    });
    it("should return the correct time for a location 105 long", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, 105, 252, "2020-04-03 22:33:15Z");
    });
    it("should return the correct time for a location 85 Long", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, 85, 252, "2020-04-03 23:53:08Z");
    });
    it("should return the correct time for a location 0 Long", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, 0, 252, "2020-04-04 05:32:42Z");
    });
    it("should return the correct time for a location -85 Long", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, -85, 252, "2020-04-04 11:12:16Z");
    });
    it("should return the correct time for a location -170 long", () => {
        
        runTest("2020-04-03 12:00:00Z", 45, -170, 252, "2020-04-03 16:53:41Z");
    });
    
    
    
});