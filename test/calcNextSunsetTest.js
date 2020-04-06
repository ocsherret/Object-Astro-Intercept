const { getNextSunsetTime } = require('../src/calcNextSunset');
const expect = require('chai').expect;

describe("#calcNextSunsetTime()", () => {
    function runTest(time, latitude, longitude, altitude, expected) {
        const actual = getNextSunsetTime(time, latitude, longitude, altitude);
        const difference = Math.abs(actual.getTime() - expected.getTime());

        if (difference > 1000) {
            expect.fail(`Actual ${actual}. Expected ${expected}.`);
        }
    }
    it("should return the correct time for a location", () => {
        
        runTest(new Date("2020-04-03 12:00:00Z"), 45, 170, 252, new Date("2020-04-04 07:12:07Z"));
    });
    it("should return the correct time for a location", () => {
        
        runTest(new Date("2020-04-03 12:00:00Z"), 45, -170, 252, new Date("2020-04-04 05:52:03Z"));
    });
    it("should return the correct time for a location", () => {
        
        runTest(new Date("2020-04-03 12:00:00Z"), 45, -85, 252, new Date("2020-04-04 00:11:45Z"));
    });
    it("should return the correct time for a location", () => {
        
        runTest(new Date("2020-04-03 12:00:00Z"), 45, 85, 252, new Date("2020-04-03 12:51:09Z"));
    });
    it("should return the correct time for a location", () => {
        
        runTest(new Date("2020-04-03 12:00:00Z"), 45, 105, 252, new Date("2020-04-04 11:32:20Z"));
    });
});