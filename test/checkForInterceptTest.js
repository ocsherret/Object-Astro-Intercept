const { checkForIntercept } = require("../src/checkForIntercept")
const expect = require("chai").expect;

describe("#checkForIntercept", () => {
    function runTest(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime, expected){
        timeNow = new Date(timeNow).getTime();
        expected = new Date(expected);
        const actual = checkForIntercept(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime)
        const difference = Math.abs(actual.timeToPoint - expected.getTime())
        if(difference > 1000){
            expect.fail(`Actual ${new Date(actual.timeToPoint).toUTCString()}. Expected ${expected.toUTCString()}.`);
        }
    }
    it("#checkForIntercept", () => {
                runTest(75, 45, -79, 30000, 600, "2020-04-04 20:24:13Z", true, "2020-04-04 22:18:45Z");
    });
})

