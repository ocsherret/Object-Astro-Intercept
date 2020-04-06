const Degrees = require("./degrees");
const deg = new Degrees();
const SunAstroTimes = require("./sunastrotimes");
const MovingObject = require("./movingobject");
const plane = new MovingObject();
let timeNow = Date.now();
let daytime = true;

let newLongitude = plane.getLongitude();
let newLatitude = plane.getLatitude();
const sun = new SunAstroTimes(
    timeNow,
    plane.getLatitude(),
    plane.getLongitude(),
    plane.getAltitudeFeet(),
);
const sun2 = new SunAstroTimes(
    timeNow,
    plane.getLatitude(),
    plane.getLongitude(),
    plane.getAltitudeFeet(),
);
const oneSecond = 1000;
const oneMinute = 60000;
const oneHour = 3600000;
const oneDay = 86400000;
let testVar = null;


function calculateProjectedLatLong(distanceToSunset, timeToPoint) {
    // Purpose of this function is to get the projected Lat/Long using a great circle line.
    // Then it uses the projected time of arrival of the object to recalculate the astro times.
    let directionRad = deg.toRadians(plane.getTrueBearing());
    let latitudeRad = deg.toRadians(plane.getLatitude());
    let longitudeRad = deg.toRadians(plane.getLongitude());
    let sunrise = null;
    let sunset = null;

    newLatitude = Math.asin(
        Math.sin(latitudeRad) * Math.cos(distanceToSunset / 3440)
            + Math.cos(latitudeRad) * Math.sin(distanceToSunset / 3440)
            * Math.cos(directionRad),
    );

    newLongitude = plane.getLongitude()
        + deg.toDegrees(
            Math.atan2(
                Math.sin(directionRad) * Math.sin(distanceToSunset / 3440)
                    * Math.cos(latitudeRad),
                Math.cos(distanceToSunset / 3440) - Math.sin(latitudeRad)
                    * Math.sin(newLatitude),
            ),
        );

    newLatitude = deg.toDegrees(newLatitude);
    if(newLongitude > 180){
        let difference = newLongitude - 180;
        newLongitude = -180 + difference;
    }else if(newLongitude < -180){
        let difference = newLongitude+180;
        newLongitude = difference + 180;
    }

    sunset = sun.calcNextSunset(timeToPoint, newLatitude, newLongitude, plane.getAltitudeFeet());
    sunrise = sun.calcNextSunrise(timeToPoint, newLatitude, newLongitude, plane.getAltitudeFeet());
    testVar = [sunrise,sunset];
    
    if(daytime === true){
        return sunset;
    }else if (daytime === false){
        return sunrise;
        
    }else{
        console.log("Error");
    }
}
function checkForIntercept() {
    let interceptTime = null;
    let timeToPoint = null;
    console.log(new Date(Date.now()).toUTCString());
    for(let i = 0; i <= plane.getSpeed()*1; i+=0.1){
        timeToPoint = i/plane.getSpeed() * oneHour + Date.now();
        interceptTime = calculateProjectedLatLong(i, timeToPoint);
        if(timeToPoint >= interceptTime){
            console.log("Time Now:              " + new Date(Date.now()).toUTCString())
            console.log("Time at Point:         "+new Date(timeToPoint).toUTCString());
            if(daytime === true){
                console.log("Sunset Time:           "+new Date(interceptTime).toUTCString());
            } else if (daytime === false){
                console.log("Sunrise Time:          "+new Date(interceptTime).toUTCString());
            }
            console.log("Lat/Long Intercept:    "+ newLatitude,newLongitude);
            break;
        } 
        if(i > (plane.getSpeed() * 1) - 0.2){
            console.log("Time at Point:         "+new Date(timeToPoint).toUTCString());
            console.log("Sunrise Time:          "+new Date(testVar[0]).toUTCString());
            console.log("Sunset Time:           "+new Date(testVar[1]).toUTCString());
            console.log("Lat/Long Intercept:    "+ newLatitude,newLongitude);
            console.log(timeToPoint > testVar[0], timeToPoint-testVar[0]);
            console.log("NO SUNRISE/SUNSET in the next six hours")
            
        }
    }
    
    
}

function check() {
    timeNow = Date.now();
    sun2.reCalcTimes(timeNow, plane.getLatitude(), plane.getLongitude(), plane.getAltitudeFeet());
    if(timeNow > (sun2.getSunrise()+oneDay) || (timeNow > sun2.getSunrise() && timeNow > sun2.getSunset())){
        sun2.reCalcTimes(timeNow+oneDay, plane.getLatitude(), plane.getLongitude(), plane.getAltitudeFeet());
    }
    console.log("||------------------------------------------------||");
    console.log("Time now:          "+new Date(timeNow).toUTCString());
    console.log("Current Pos SR:    "+new Date(sun2.getSunrise()).toUTCString());
    console.log("Current Pos SS:    "+new Date(sun2.getSunset()).toUTCString());
    

    if(timeNow >= sun2.getSunrise() && timeNow <= sun2.getSunset()){
        console.log("DAYTIME");
        daytime = true;
    }else{
        console.log("NIGHTTIME");
        daytime = false;
    }
    checkForIntercept();
    plane.move(5000);
}

check();
//checkForSunriseIntercept();
const myHeartBeat = setInterval(check, 5000);
