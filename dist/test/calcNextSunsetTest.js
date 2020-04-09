"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sunastrotimes_1 = require("../sunastrotimes");
var chai_1 = require("chai");
describe("#calcNextSunsetTime()", function () {
    function runTest(time, latitude, longitude, altitude, expected) {
        var timeNum = new Date(time).getTime();
        var expectedNum = new Date(expected).getTime();
        var actual = new sunastrotimes_1.SunAstroTimes(timeNum, latitude, longitude, altitude);
        var difference = Math.abs(actual.getNextSunset() - expectedNum);
        if (difference > 1000) {
            chai_1.expect.fail("Actual " + actual + ". Expected " + expected + ".");
        }
    }
    it("should return the correct time for a location", function () {
        runTest("2020-04-03 12:00:00Z", 45, 170, 252, "2020-04-04 07:12:07Z");
    });
    it("should return the correct time for a location", function () {
        runTest("2020-04-03 12:00:00Z", 45, -170, 252, "2020-04-04 05:52:03Z");
    });
    it("should return the correct time for a location", function () {
        runTest("2020-04-03 12:00:00Z", 45, -85, 252, "2020-04-04 00:11:45Z");
    });
    it("should return the correct time for a location", function () {
        runTest("2020-04-03 12:00:00Z", 45, 85, 252, "2020-04-03 12:51:09Z");
    });
    it("should return the correct time for a location", function () {
        runTest("2020-04-03 12:00:00Z", 45, 105, 252, "2020-04-04 11:32:20Z");
    });
});
