const Degrees = require("./degrees");
const SunAstroTimes = require("./sunastrotimes");
const MovingObject = require("./movingobject");
const movingUFO = new MovingObject();
const logger = require("./loging");
const timingInterval = 5000;
const oneSecond = 1000;
const oneMinute = 60000;
const oneHour = 3600000;
const oneDay = 86400000;

function calculateProjectedLatLong (distanceToPoint, timeToPoint, objTrueBearing, objLatitude, objLongitude, objAltitude, timeNow, daytime) {
    // Purpose of this function is to get the projected Lat/Long using a great circle line.
    // Then it uses the projected time of arrival of the object to recalculate the astro times.
    let directionRad = Degrees.toRadians(objTrueBearing);
    let latitudeRad = Degrees.toRadians(objLatitude);
    let newLongitude = objLongitude;
    let newLatitude = objLatitude;
    let nextSunrise = null;
    let nextSunset = null;
    let nextSunTime = null;

    const sun = new SunAstroTimes(
        timeNow,
        movingUFO.getLatitude(),
        movingUFO.getLongitude(),
        movingUFO.getAltitudeFeet(),
    );
    newLatitude = Math.asin(
        Math.sin(latitudeRad) * Math.cos(distanceToPoint / 3440)
        + Math.cos(latitudeRad) * Math.sin(distanceToPoint / 3440)
        * Math.cos(directionRad),
    );

    newLongitude = objLongitude
        + Degrees.toDegrees(
            Math.atan2(
                Math.sin(directionRad) * Math.sin(distanceToPoint / 3440)
                * Math.cos(latitudeRad),
                Math.cos(distanceToPoint / 3440) - Math.sin(latitudeRad)
                * Math.sin(newLatitude),
            ),
        );

    newLatitude = Degrees.toDegrees(newLatitude);
    if (newLongitude > 180) {
        let difference = newLongitude - 180;
        newLongitude = -180 + difference;
    } else if (newLongitude < -180) {
        let difference = newLongitude + 180;
        newLongitude = difference + 180;
    }

    nextSunset = sun.calcNextSunset(
        timeToPoint,
        newLatitude,
        newLongitude,
        objAltitude,
    );
    nextSunrise = sun.calcNextSunrise(
        timeToPoint,
        newLatitude,
        newLongitude,
        objAltitude,
    );

    if (daytime === true) {
        nextSunTime = nextSunset;
        return {nextSunTime, timeToPoint, newLatitude, newLongitude};
    } else if (daytime === false) {
        nextSunTime = nextSunrise;
        return {nextSunTime, timeToPoint, newLatitude, newLongitude};
    } else {
        throw new Error("Error in returning next Sunrise, or the next Sunset");
    }
}
function checkForIntercept(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime) {
    // This function works by drawing an imaginary growing line in front of the object
    // At each point the next sunset, and sunrise time is checked.
    // Also the time it will take for the object to reach that point is calculated.
    // Once the time to reach the point is greater than the sunset/sunrise at that point
    // the time is returned.
    let interceptTime = null;
    let timeToPoint = null;
    let newLatitude = null;
    let newLongitude = null;
    for (let i = 0; i <= objSpeed * 6; i += 0.1) {
        // In this case 'i' is distance
        timeToPoint = i / objSpeed * oneHour + timeNow;
        const intercept = calculateProjectedLatLong(i, timeToPoint, objTrueBearing, objLatitude, objLongitude, objAltitude, timeNow, daytime);
        interceptTime = intercept.nextSunTime;
        
        if (timeToPoint >= interceptTime - timingInterval * 1.25) {
            //Returns the time now
            //Returns the time to the Point
            //Returns the interceptTime, which is also the sunset/sunrise at the point
            //Returns the latitude at that point
            //Returns the longitude at that point
            //Returns weather the object is Currently in Daylight
            newLatitude = intercept.newLatitude;
            newLongitude = intercept.newLongitude;
            return {timeNow, timeToPoint, interceptTime, newLatitude, newLongitude};
        }   
    }
    
    return undefined;
}

function checkState(obj, timeDate) {
    const objTrueBearing = obj.getTrueBearing();
    const objLatitude = obj.getLatitude();
    const objLongitude = obj.getLongitude();
    const objAltitude = obj.getAltitudeFeet();
    const objSpeed = obj.getSpeed();
    let timeNow = timeDate;
    let daytime = true;

    const currentSunPosition = new SunAstroTimes(
        timeNow,
        movingUFO.getLatitude(),
        movingUFO.getLongitude(),
        movingUFO.getAltitudeFeet(),
    );
    if (
        timeNow > (currentSunPosition.getSunrise() + oneDay)
        || (timeNow > currentSunPosition.getSunrise()
            && timeNow > currentSunPosition.getSunset())
    ) {
        currentSunPosition.reCalcTimes(
            timeNow + oneDay,
            objLatitude,
            objLongitude,
            objAltitude,
        );
    }
    //Checks to see if the object currently in day or nighttime conditions
    if (
        timeNow >= currentSunPosition.getSunrise()
        && timeNow <= currentSunPosition.getSunset()
    ) {
        logger.log("Day State:  DAYTIME");
        daytime = true;
    } else {
        logger.log("Day State: NIGHTTIME");
        daytime = false;
    }
    checkForIntercept(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime);
}
module.exports = {checkState, checkForIntercept, calculateProjectedLatLong}
checkState(movingUFO, Date.now());