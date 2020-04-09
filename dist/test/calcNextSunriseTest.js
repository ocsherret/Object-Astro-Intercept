"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sunastrotimes_1 = require("../sunastrotimes");
var chai_1 = require("chai");
describe("#calcNextSunriseTime()", function () {
    function runTest(time, latitude, longitude, altitude, expected) {
        var timeNum = new Date(time).getTime();
        var expectedNum = new Date(expected).getTime();
        var actual = new sunastrotimes_1.SunAstroTimes(timeNum, latitude, longitude, altitude);
        var difference = Math.abs(actual.getNextSunrise() - expectedNum);
        if (difference > 1000) {
            chai_1.expect.fail("Actual " + actual + ". Expected " + expected + ".");
        }
    }
    it("should return the correct time for a location 170 long", function () {
        runTest("2020-04-03 12:00:00Z", 45, 170, 252, "2020-04-03 18:13:35Z");
    });
    it("should return the correct time for a location 105 long", function () {
        runTest("2020-04-03 12:00:00Z", 45, 105, 252, "2020-04-03 22:33:15Z");
    });
    it("should return the correct time for a location 85 Long", function () {
        runTest("2020-04-03 12:00:00Z", 45, 85, 252, "2020-04-03 23:53:08Z");
    });
    it("should return the correct time for a location 0 Long", function () {
        runTest("2020-04-03 12:00:00Z", 45, 0, 252, "2020-04-04 05:32:42Z");
    });
    it("should return the correct time for a location -85 Long", function () {
        runTest("2020-04-03 12:00:00Z", 45, -85, 252, "2020-04-04 11:12:16Z");
    });
    it("should return the correct time for a location -170 long", function () {
        runTest("2020-04-03 12:00:00Z", 45, -170, 252, "2020-04-03 16:53:41Z");
    });
});
