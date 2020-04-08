const { getProjectedLatLong } = require('../src/calculateProjectedLatLong');
const expect = require('chai').expect;

describe("#calculateProjectedLatLong", () =>{
    function runTest(distanceToPoint, timeToPoint, objTrueBearing, objLatitude, objLongitude, objAltitude, timeNow, daytime, expected){
        timeToPoint = new Date(timeToPoint).getTime();
        expected = new Date(expected);
        const actual = getProjectedLatLong(distanceToPoint, timeToPoint, objTrueBearing, objLatitude, objLongitude, objAltitude,timeNow, daytime);
        const difference = Math.abs(actual.nextSunTime - expected.getTime());
        if (difference > 1000) {
            expect.fail(`Actual ${new Date(actual.nextSunTime).toUTCString()}. Expected ${expected.toUTCString()}.`);
        }
        
    };
    it("should return the next Sunset 300NM east from 45N 20.5W if standing there at 2020-04-03 18:13Z", () => {
        
        runTest(300, "2020-04-03 18:13:00Z", 75, 45, 20.5, 30000, "2020-04-03 17:50:00Z", true, "2020-04-04 17:01:31Z");
    });
    it("should return the next Sunrise 300NM east 20.5W if standing there at 2020-04-03 18:13Z", () => {
        
        runTest(300, "2020-04-03 18:13:00Z", 75, 45, 20.5, 30000,"2020-04-03 17:50:00Z", false, "2020-04-04 03:24:13Z");
    });
})