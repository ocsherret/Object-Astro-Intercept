const Degrees = require("./degrees");
const deg = new Degrees();
const SunAstroTimes = require("./sunastrotimes");
const MovingObject = require("./movingobject");
const plane = new MovingObject();
let timeNow = Date.now();
console.log(new Date());
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
    sun.reCalcTimes(
        timeToPoint,
        newLatitude,
        newLongitude,
        plane.getAltitudeFeet(),
    );
    // console.log(newLatitude,newLongitude);
}
function checkForSunsetIntercept() {
    let timeToPoint = 0;
    for (let i = 1; i <= plane.getSpeed() * 6; i += 0.1) {
        timeToPoint = i / plane.getSpeed() * oneHour + timeNow;
        calculateProjectedLatLong(i, timeToPoint);
        if (sun.getSunset() <= timeToPoint) {
            console.log(
                "Sunset is:         " + new Date(sun.getSunset()).toString(),
            );
            console.log(
                "Intercept time is: " + new Date(timeToPoint).toString(),
            );
            console.log("Time now is:       " + new Date(timeNow).toString());
            console.log("Lat Long is:       " + newLatitude, newLongitude);
            console.log("Distance to go is: " + i + "NM");
            console.log(
                "Time to go is:     " + (timeToPoint - timeNow) / oneHour
                    + "Hrs",
            );
            break;
        }
    }
}
function checkForSunriseIntercept() {
    let timeToPoint = 0;
    for (let i = plane.getSpeed() * 6; i >= 0 ; i -= 0.1) {
        timeToPoint = i / plane.getSpeed() * oneHour + timeNow;

        calculateProjectedLatLong(i, timeToPoint);
        console.log(new Date(timeToPoint).toString());
        console.log(new Date(sun.getSunrise()).toString());

        if (sun.getSunrise() >= timeToPoint) {
            console.log("||------------------------------------------------------------------||")
            console.log(
                "Sunrise is:            "
                    + new Date(sun.getSunrise()).toString(),
            );
            console.log(
                "Intercept time is:     " + new Date(timeToPoint).toString(),
            );
            console.log(
                "Time now is:           " + new Date(timeNow).toString(),
            );
            console.log("Lat Long is:           " + newLatitude.toFixed(3), newLongitude.toFixed(3));
            console.log("Distance to go is:     " + i.toFixed(1) + "NM");
            console.log(
                "Time to go is:         " + ((timeToPoint - timeNow) / oneHour).toFixed(2)
                    + "Hrs",
            );
            break;
        }else{
            console.log("No sunrise expected in the next six hours.");
            break;
        }
    }
    // console.log("No expected sunrise in :" + 15000/speed + "Hrs.")
}
function check() {
    timeNow = Date.now();
    sun2.reCalcTimes(
        timeNow,
        plane.getLatitude(),
        plane.getLongitude(),
        plane.getAltitudeFeet(),
    );
    if(timeNow > sun2.getSunrise() && timeNow < sun2.getSunset()){
        checkForSunsetIntercept();
    } else {
        checkForSunriseIntercept();
    }

    plane.move();
    
}
const myHeartBeat = setInterval(check, 5000);
