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
const position = new SunAstroTimes(
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
    let nextSunrise = null;
    let nextSunset = null;

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

    nextSunset = sun.calcNextSunset(timeToPoint, newLatitude, newLongitude, plane.getAltitudeFeet());
    nextSunrise = sun.calcNextSunrise(timeToPoint, newLatitude, newLongitude, plane.getAltitudeFeet());
    testVar = [nextSunrise,nextSunset];
    
    if(daytime === true){
        return nextSunset;
    }else if (daytime === false){
        return nextSunrise;
        
    }else{
        console.log("Error");
    }
}
function checkForIntercept() {
    let interceptTime = null;
    let timeToPoint = null;
    let timeToGo = null;
    console.log(new Date(Date.now()).toUTCString());
    for(let i = 0; i <= plane.getSpeed()*6; i+=0.1){
        timeToPoint = i/plane.getSpeed() * oneHour + Date.now();
        interceptTime = calculateProjectedLatLong(i, timeToPoint);
        timeToGo = (timeToPoint - Date.now()) / oneHour;
        
        if(timeToPoint >= interceptTime - 6000){
            console.log("Time to Intercept:     " +timeToGo+"HRS");
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
        if(i > (plane.getSpeed() * 6) - 0.1){
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
    position.reCalcTimes(timeNow, plane.getLatitude(), plane.getLongitude(), plane.getAltitudeFeet());
    if(timeNow > (position.getSunrise()+oneDay) || (timeNow > position.getSunrise() && timeNow > position.getSunset())){
        position.reCalcTimes(timeNow+oneDay, plane.getLatitude(), plane.getLongitude(), plane.getAltitudeFeet());
    }
    console.log("||------------------------------------------------||");
    console.log("Time now:          "+new Date(timeNow).toUTCString());
    console.log("Current Pos SR:    "+new Date(position.getSunrise()).toUTCString());
    console.log("Current Pos SS:    "+new Date(position.getSunset()).toUTCString());
    

    if(timeNow >= position.getSunrise() && timeNow <= position.getSunset()){
        console.log("DAYTIME");
        daytime = true;
    }else{
        console.log("NIGHTTIME");
        daytime = false;
    }
    checkForIntercept();
    plane.move(5000);
}

//
//checkForSunriseIntercept();
const myHeartBeat = setInterval(check, 5000);
