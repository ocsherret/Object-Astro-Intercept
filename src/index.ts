import * as Degrees from "./degrees";
import * as SunCalc from "suncalc";
const timingInterval = 5000;
const oneSecond = 1000;
const oneMinute = 60000;
const oneHour = 3600000;
const oneDay = 86400000;


interface MovingObject{
    trueBearing: number;
    latitude: number;
    longitude: number;
    altitudeFeet:number;
    speed: number;
}
export function checkState(obj: MovingObject, timeDate: number) {
    const objTrueBearing = obj.trueBearing;
    const objLatitude = obj.latitude;
    const objLongitude = obj.longitude;
    const objAltitude = obj.altitudeFeet * 0.3048;
    const objSpeed = obj.speed;
    let timeNow = timeDate;
    let daytime = true;

    //the properties of the moving object are passed into this function
    //to check to see if we are looking for a sunrise or a sunset

    const altAdj = Degrees.toRadians(1.15 * Math.sqrt(objAltitude) / 60);
    
    //Checks to see if the object currently in day or nighttime conditions
    if (SunCalc.getPosition(new Date(), objLatitude, objLongitude).altitude + altAdj >= 0) {
        //log("Day State:  DAYTIME");
        daytime = true;
    } else {
       // log("Day State: NIGHTTIME");
        daytime = false;
    }
    //Using the properties of the object we now check to see when it intercepts sunrise/sunset
    return checkForIntercept(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime);
    
}

export function checkForIntercept(
    objTrueBearing: number, 
    objLatitude: number, 
    objLongitude: number, 
    objAltitude: number, 
    objSpeed: number, 
    timeNow: number, 
    daytime: boolean) {

    // This function works by drawing an imaginary growing line in front of the object
    // At each point the next sunset, and sunrise time is checked.
    // Also the time it will take for the object to reach that point is calculated.
    // Once the time to reach the point is greater than the sunset/sunrise at that point
    // the time is returned.
    let sunAlt = null;
    let timeToPoint = null;
    let newLatitude = null;
    let newLongitude = null;
    if(objSpeed !== 0) {
        for (let i = 0; i <= objSpeed * 24; i += 0.1) {
            // In this case 'i' is distance
            timeToPoint = i / objSpeed * oneHour + timeNow;
            const intercept = calculateProjectedLatLong(i, timeToPoint, objTrueBearing, objLatitude, objLongitude, objAltitude, timeNow, daytime);
            sunAlt = intercept.sunAlt;

            if(daytime === true && sunAlt <= 0){
                newLatitude = intercept.newLatitude;
                newLongitude = intercept.newLongitude;
                return {timeNow, timeToPoint, newLatitude, newLongitude};
            }else if(daytime === false && sunAlt > 0){
                newLatitude = intercept.newLatitude;
                newLongitude = intercept.newLongitude;
                return {timeNow, timeToPoint, newLatitude, newLongitude};
            }
            
        }
    } else if (objSpeed === 0 && daytime === true) {
        timeToPoint = SunCalc.getTimes(timeNow,objLatitude, objLongitude,objAltitude/3.28084).sunset.getTime();
        return {timeNow, timeToPoint, objLatitude, objLongitude};
    } else if (objSpeed === 0 && daytime === false) {
        timeToPoint = SunCalc.getTimes(timeNow,objLatitude, objLongitude,objAltitude/3.28084).sunrise.getTime();
        return {timeNow, timeToPoint, objLatitude, objLongitude};
    } else {
        return undefined;
    }
}
export function calculateProjectedLatLong (
    distanceToPoint: number, 
    timeToPoint: number, 
    objTrueBearing: number, 
    objLatitude: number, 
    objLongitude: number, 
    objAltitude: number, 
    timeNow: number, 
    daytime: boolean) {
    // Purpose of this function is to get the projected Lat/Long using a great circle line.
    // Then it uses the projected time of arrival of the object to recalculate the astro times.
    let directionRad = Degrees.toRadians(objTrueBearing);
    let latitudeRad = Degrees.toRadians(objLatitude);
    let newLongitude = objLongitude;
    let newLatitude = objLatitude;

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
    const altAdj = Degrees.toRadians(1.15 * Math.sqrt(objAltitude) / 60);
    const sunAlt = SunCalc.getPosition(timeToPoint, newLatitude, newLongitude).altitude + altAdj;
    
    if (daytime === true) {
        return {sunAlt, timeToPoint, newLatitude, newLongitude};
    } else if (daytime === false) {
        return {sunAlt, timeToPoint, newLatitude, newLongitude};
    } else {
        throw new Error("Error in returning next Sunrise, or the next Sunset");
    }
}


