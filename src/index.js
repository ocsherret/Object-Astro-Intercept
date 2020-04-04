const Degrees = require("./degrees");
const deg = new Degrees();
const SunAstroTimes = require("./sunastrotimes");
const MovingObject = require("./movingobject");
const plane = new MovingObject();
let timeNow = Date.now();

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


function calculateProjectedLatLong(distanceToSunset, timeToPoint) {
    // Purpose of this function is to get the projected Lat/Long using a great circle line.
    // Then it uses the projected time of arrival of the object to recalculate the astro times.
    let directionRad = deg.toRadians(plane.getTrueBearing());
    let latitudeRad = deg.toRadians(plane.getLatitude());
    let longitudeRad = deg.toRadians(plane.getLongitude());

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



        
    sun.calcNextSunset(
        timeToPoint,
        newLatitude,
        newLongitude,
        plane.getAltitudeFeet(),
    );

     //console.log(newLatitude,newLongitude);
}
function checkForSunsetIntercept() {
    let timeToPoint = 0;
    /*let i = 300;
    
    console.log(
        "Sunset is:         " + new Date(sun.getSunset()).toUTCString(),
    );
    console.log(
        "Intercept time is: " + new Date(timeToPoint).toUTCString(),
    );
    console.log(sun.getSunset() <= timeToPoint);
        */
    for (let i = 0; i <= plane.getSpeed() * 7; i += 0.1) {
        timeToPoint = i / plane.getSpeed() * oneHour + timeNow;
        calculateProjectedLatLong(i, timeToPoint);
        

        if (sun.getSunset() <= timeToPoint) {
            console.log(
                "Sunset is:         " + new Date(sun.getSunset()).toUTCString(),
            );
            console.log(
                "Intercept time is: " + new Date(timeToPoint).toUTCString(),
            );
            console.log("Time now is:       " + new Date(timeNow).toUTCString());
            console.log("Lat Long is:       " + newLatitude.toFixed(3), newLongitude.toFixed(3));
            console.log("Distance to go is: " + i.toFixed(2) + "NM");
            console.log(
                "Time to go is:     " + ((timeToPoint - timeNow) / oneHour).toFixed(2)
                    + "Hrs",
            );
            break;
        }
    }
    /*timeNow = Date.now();
    sun.calcNextSunset(
        timeNow,
        plane.getLatitude(),
        plane.getLongitude(),
        plane.getAltitudeFeet(),
    );
    console.log("Next sunset:   "+new Date(sun.getSunset()).toUTCString());
    console.log("Time now:      "+new Date(Date.now()).toUTCString());
    */
}
function checkForSunriseIntercept() {
    
}
function check() {
    timeNow = Date.now();
    checkForSunsetIntercept();
    /*sun.reCalcTimes(
        timeNow,
        plane.getLatitude(),
        plane.getLongitude(),
        plane.getAltitudeFeet(),
    );
    if(timeNow > sun.getSunrise() && timeNow < sun.getSunset()){
        checkForSunsetIntercept();
    } else {
        checkForSunriseIntercept();
    }*/

    plane.move(5000);
    
}

function tester(){
    sun.reCalcTimes(
        timeNow,
        newLatitude,
        newLongitude,
        plane.getAltitudeFeet(),
    );
    console.log(new Date(Date.now()).toUTCString());
}
tester();
//checkForSunriseIntercept();
const myHeartBeat = setInterval(check, 5000);
