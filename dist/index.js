"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Degrees = __importStar(require("./degrees"));
var sunastrotimes_1 = require("./sunastrotimes");
var movingobject_1 = require("./movingobject");
var loging_1 = require("./loging");
var timingInterval = 5000;
var oneSecond = 1000;
var oneMinute = 60000;
var oneHour = 3600000;
var oneDay = 86400000;
function calculateProjectedLatLong(distanceToPoint, timeToPoint, objTrueBearing, objLatitude, objLongitude, objAltitude, timeNow, daytime) {
    // Purpose of this function is to get the projected Lat/Long using a great circle line.
    // Then it uses the projected time of arrival of the object to recalculate the astro times.
    var directionRad = Degrees.toRadians(objTrueBearing);
    var latitudeRad = Degrees.toRadians(objLatitude);
    var newLongitude = objLongitude;
    var newLatitude = objLatitude;
    var nextSunrise = null;
    var nextSunset = null;
    var nextSunTime = null;
    var sun = new sunastrotimes_1.SunAstroTimes(timeNow, objLatitude, objLongitude, objAltitude);
    newLatitude = Math.asin(Math.sin(latitudeRad) * Math.cos(distanceToPoint / 3440)
        + Math.cos(latitudeRad) * Math.sin(distanceToPoint / 3440)
            * Math.cos(directionRad));
    newLongitude = objLongitude
        + Degrees.toDegrees(Math.atan2(Math.sin(directionRad) * Math.sin(distanceToPoint / 3440)
            * Math.cos(latitudeRad), Math.cos(distanceToPoint / 3440) - Math.sin(latitudeRad)
            * Math.sin(newLatitude)));
    newLatitude = Degrees.toDegrees(newLatitude);
    if (newLongitude > 180) {
        var difference = newLongitude - 180;
        newLongitude = -180 + difference;
    }
    else if (newLongitude < -180) {
        var difference = newLongitude + 180;
        newLongitude = difference + 180;
    }
    nextSunset = sun.calcNextSunset(timeToPoint, newLatitude, newLongitude, objAltitude);
    nextSunrise = sun.calcNextSunrise(timeToPoint, newLatitude, newLongitude, objAltitude);
    if (daytime === true) {
        nextSunTime = nextSunset;
        return { nextSunTime: nextSunTime, timeToPoint: timeToPoint, newLatitude: newLatitude, newLongitude: newLongitude };
    }
    else if (daytime === false) {
        nextSunTime = nextSunrise;
        return { nextSunTime: nextSunTime, timeToPoint: timeToPoint, newLatitude: newLatitude, newLongitude: newLongitude };
    }
    else {
        throw new Error("Error in returning next Sunrise, or the next Sunset");
    }
}
exports.calculateProjectedLatLong = calculateProjectedLatLong;
function checkForIntercept(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime) {
    // This function works by drawing an imaginary growing line in front of the object
    // At each point the next sunset, and sunrise time is checked.
    // Also the time it will take for the object to reach that point is calculated.
    // Once the time to reach the point is greater than the sunset/sunrise at that point
    // the time is returned.
    var interceptTime = null;
    var timeToPoint = null;
    var newLatitude = null;
    var newLongitude = null;
    for (var i = 0; i <= objSpeed * 6; i += 0.1) {
        // In this case 'i' is distance
        timeToPoint = i / objSpeed * oneHour + timeNow;
        var intercept = calculateProjectedLatLong(i, timeToPoint, objTrueBearing, objLatitude, objLongitude, objAltitude, timeNow, daytime);
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
            return { timeNow: timeNow, timeToPoint: timeToPoint, interceptTime: interceptTime, newLatitude: newLatitude, newLongitude: newLongitude };
        }
    }
    return undefined;
}
exports.checkForIntercept = checkForIntercept;
function checkState(obj, timeDate) {
    var objTrueBearing = obj.trueBearing;
    var objLatitude = obj.latitude;
    var objLongitude = obj.longitude;
    var objAltitude = obj.altitudeFeet;
    var objSpeed = obj.speed;
    var timeNow = timeDate;
    var daytime = true;
    var currentSunPosition = new sunastrotimes_1.SunAstroTimes(timeNow, objLatitude, objLongitude, objAltitude);
    if (timeNow > (currentSunPosition.getSunrise() + oneDay)
        || (timeNow > currentSunPosition.getSunrise()
            && timeNow > currentSunPosition.getSunset())) {
        currentSunPosition.reCalcTimes(timeNow + oneDay, objLatitude, objLongitude, objAltitude);
    }
    //Checks to see if the object currently in day or nighttime conditions
    if (timeNow >= currentSunPosition.getSunrise()
        && timeNow <= currentSunPosition.getSunset()) {
        loging_1.log("Day State:  DAYTIME");
        daytime = true;
    }
    else {
        loging_1.log("Day State: NIGHTTIME");
        daytime = false;
    }
    checkForIntercept(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime);
}
exports.checkState = checkState;
checkState(new movingobject_1.MovingObject(), Date.now());
