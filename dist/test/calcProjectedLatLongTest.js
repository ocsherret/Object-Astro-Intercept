"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var chai_1 = require("chai");
describe("#calculateProjectedLatLong", function () {
    function runTest(distanceToPoint, timeToPoint, objTrueBearing, objLatitude, objLongitude, objAltitude, timeNow, daytime, expected) {
        var timeToPointNum = new Date(timeToPoint).getTime();
        var expectedTime = new Date(expected).getTime();
        var timeNum = new Date(timeNow).getTime();
        var actual = index_1.calculateProjectedLatLong(distanceToPoint, timeToPointNum, objTrueBearing, objLatitude, objLongitude, objAltitude, timeNum, daytime);
        var difference = Math.abs(actual.nextSunTime - expectedTime);
        if (difference > 1000) {
            chai_1.expect.fail("Actual " + new Date(actual.nextSunTime).toUTCString() + ". Expected " + expected + ".");
        }
    }
    ;
    it("should return the next Sunset 300NM east from 45N 20.5W if standing there at 2020-04-03 18:13Z", function () {
        runTest(300, "2020-04-03 18:13:00Z", 75, 45, 20.5, 30000, "2020-04-03 17:50:00Z", true, "2020-04-04 17:01:31Z");
    });
    it("should return the next Sunrise 300NM east 20.5W if standing there at 2020-04-03 18:13Z", function () {
        runTest(300, "2020-04-03 18:13:00Z", 75, 45, 20.5, 30000, "2020-04-03 17:50:00Z", false, "2020-04-04 03:24:13Z");
    });
});
