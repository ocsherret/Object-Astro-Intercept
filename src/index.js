const Degrees = require("./degrees")
const deg = new Degrees();
const SunAstroTimes = require("./sunastrotimes")

const timeNow = new Date;
console.log(new Date)
let latitude = 43;
let longitude = -79;
let altitude = 30000
let newLongitude = longitude;
let newLatitude = latitude;
const sun = new SunAstroTimes(timeNow, latitude, longitude, altitude);
const oneSecond = 1000;
const oneMinute = 60000;
const oneHour = 3600000;
const oneDay = 86400000;
let  speed = 600;
const knotsToDegrees = 1/60;

function calculateProjectedLatLong(distanceToSunset){
    let direction = 45;
    let directionRad = deg.toRadians(direction);
    let latitudeRad = deg.toRadians(latitude);
    let longitudeRad = deg.toRadians(longitude);
    

    newLatitude = Math.asin(
                            Math.sin(latitudeRad) * Math.cos(distanceToSunset/3440)
                                + Math.cos(latitudeRad) * Math.sin(distanceToSunset/3440) * Math.cos(directionRad)); 

    
    newLongitude = longitude + deg.toDegrees(Math.atan2(Math.sin(directionRad) * Math.sin(distanceToSunset/3440) * Math.cos(latitudeRad),
                                    Math.cos(distanceToSunset/3440) - Math.sin(latitudeRad) * Math.sin(newLatitude)));
    
    
    newLatitude = deg.toDegrees(newLatitude);
    sun.reCalcTimes(timeNow, newLatitude, newLongitude, altitude);
    
    
    
}
function checkForSunsetIntercept(){    
    for(let i = 1; i <= 6000; i++){
        timeToPoint = i/ speed * oneHour + Date.now();
        calculateProjectedLatLong(i);
        if(sun.getSunset() <= timeToPoint){
            console.log("Sunset is:         "+new Date(sun.getSunset()).toString());
            console.log("Intercept time is: "+new Date(timeToPoint).toString());
            console.log("Lat Long is:       "+newLatitude, newLongitude);
            console.log("Distance to go is: " + i +"NM");
            console.log("Time to go is:     " + timeToPoint);
            break;
        }
    }
}
function checkForSunriseIntercept(){    
    for(let i = 15000; i >= 0; i--){
        timeToPoint = i / speed * oneHour + Date.now();
        calculateProjectedLatLong(i);
       
        if(sun.getSunrise() >= timeToPoint){
            console.log("Sunrise is:         "+new Date(sun.getSunrise()).toString());
            console.log("Intercept time is: "+new Date(timeToPoint).toString());
            console.log("Lat Long is:       "+newLatitude, newLongitude);
            console.log("Distance to go is: " + i +"NM");
            console.log("Time to go is:     " + timeToPoint);
            break;
        }   
        
    }
    console.log("No expected sunrise in :" + 15000/speed + "Hrs.")
}
function check(){
    checkForSunsetIntercept();
    checkForSunriseIntercept();
}
const myHeartBeat = setInterval(check, 5000);

 