import { SunAstroTimes } from "../sunastrotimes"
import { expect } from "chai";

describe("#getSunsetTime()", () => {
    function runTest(time: string, latitude: number, longitude: number, altitude: number, expected: string) {
        const timeNum = new Date(time).getTime();
        const expectedDate = new Date(expected).getTime();

        const actual = new SunAstroTimes(timeNum, latitude, longitude, altitude);
        const difference = Math.abs(actual.getSunset() - expectedDate);

        if (difference > 1000) {
            expect.fail(`Actual ${new Date(actual.getSunset()).toUTCString()}. Expected ${new Date(expected).toUTCString()}.`);
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
