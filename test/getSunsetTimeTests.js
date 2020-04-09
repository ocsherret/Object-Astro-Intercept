const { getSunsetTime } = require('../src/getSunsetTime');
const expect = require('chai').expect;

describe("#getSunsetTime()", () => {
    function runTest(time, latitude, longitude, altitude, expected) {
        time = new Date(time);
        expected = new Date(expected);

        const actual = getSunsetTime(time, latitude, longitude, altitude);
        const difference = Math.abs(actual.getTime() - expected.getTime());

        if (difference > 1000) {
            expect.fail(`Actual ${actual}. Expected ${expected}.`);
        }
    }
    it("should return the correct time for a location", () => {
        runTest("2020-04-01 12:00:00Z", 45, 170, 252, "2020-04-01 07:08:20Z");
    });
    it("should return the correct time for a location", () => {
        runTest("2020-04-01 12:00:00Z", 45, 80, 252, "2020-04-01 13:08:39Z");
    });
    it("should return the correct time for a location", () => {
        runTest("2020-04-01 12:00:00Z", 45, -80, 252, "2020-04-01 23:49:13Z");
    });
    it("should return the correct time for a location", () => {
        runTest("2020-04-01 12:00:00Z", 45, -160, 252, "2020-04-02 05:09:29Z");
    });
});
