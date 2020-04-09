"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sunastrotimes_1 = require("../sunastrotimes");
var chai_1 = require("chai");
describe("#getSunsetTime()", function () {
    function runTest(time, latitude, longitude, altitude, expected) {
        var timeNum = new Date(time).getTime();
        var expectedDate = new Date(expected).getTime();
        var actual = new sunastrotimes_1.SunAstroTimes(timeNum, latitude, longitude, altitude);
        var difference = Math.abs(actual.getSunset() - expectedDate);
        if (difference > 1000) {
            chai_1.expect.fail("Actual " + new Date(actual.getSunset()).toUTCString() + ". Expected " + new Date(expected).toUTCString() + ".");
        }
    }
    it("should return the correct time for a location", function () {
        runTest("2020-04-01 12:00:00Z", 45, 170, 252, "2020-04-01 07:08:20Z");
    });
    it("should return the correct time for a location", function () {
        runTest("2020-04-01 12:00:00Z", 45, 80, 252, "2020-04-01 13:08:39Z");
    });
    it("should return the correct time for a location", function () {
        runTest("2020-04-01 12:00:00Z", 45, -80, 252, "2020-04-01 23:49:13Z");
    });
    it("should return the correct time for a location", function () {
        runTest("2020-04-01 12:00:00Z", 45, -160, 252, "2020-04-02 05:09:29Z");
    });
});
