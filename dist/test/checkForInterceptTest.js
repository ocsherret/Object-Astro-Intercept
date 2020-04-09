"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("../index.js");
var chai_1 = require("chai");
//const expect = require("chai").expect;
describe("#checkForIntercept", function () {
    function runTest(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime, expectedDate) {
        var timeNum = new Date(timeNow).getTime();
        var expected = new Date(expectedDate).getTime();
        var actual = index_js_1.checkForIntercept(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNum, daytime);
        var difference = Math.abs(actual.timeToPoint - expected);
        if (difference > 1000) {
            chai_1.expect.fail("Actual " + new Date(actual.timeToPoint).toUTCString() + ". Expected " + new Date(expected).toUTCString() + ".");
        }
    }
    it("#checkForIntercept", function () {
        runTest(75, 45, -79, 30000, 600, "2020-04-04 20:24:13Z", true, "2020-04-04 22:18:45Z");
    });
});
