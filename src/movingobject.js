const Degrees = require("./degrees");
const deg = new Degrees();

class MovingObject {
    constructor() {
        this.trueBearing = 275;
        this.latitude = 45;
        this.longitude = 97.9;
        this.altitudeFeet = 30000;
        this.speed = 300;
    }
    getTrueBearing() {
        return this.trueBearing;
    }
    setTrueBearing(trueBearing) {
        this.trueBearing = trueBearing;
    }
    getLatitude() {
        return this.latitude;
    }
    setLatitude(latitude) {
        this.latitude = latitude;
    }
    getLongitude() {
        return this.longitude;
    }
    setLongitude(longitude) {
        this.longitude = longitude;
    }
    getAltitudeFeet() {
        return this.altitudeFeet;
    }
    setAltitudeFeet(altitudeFeet) {
        this.altitudeFeet = altitudeFeet;
    }
    getSpeed() {
        return this.speed;
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    move(heartbeatInterval) {
        let directionRad = deg.toRadians(this.trueBearing);
        let latitudeRad = deg.toRadians(this.latitude);
        let longitudeRad = deg.toRadians(this.longitude);
        let newLatitude = this.latitude;
        let newLongitude = this.longitude;
        let newBearing = this.trueBearing;
        let newBearingY = null;
        let newBearingX = null;
        let funcDistance = this.speed * (heartbeatInterval / 3600000);

        newLatitude = Math.asin(
            Math.sin(latitudeRad) * Math.cos(funcDistance / 3440)
                + Math.cos(latitudeRad) * Math.sin(funcDistance / 3440)
                * Math.cos(directionRad),
        );

        newLongitude = this.longitude
            + deg.toDegrees(
                Math.atan2(
                    Math.sin(directionRad) * Math.sin(funcDistance / 3440)
                        * Math.cos(latitudeRad),
                    Math.cos(funcDistance / 3440) - Math.sin(latitudeRad)
                        * Math.sin(newLatitude),
                ),
            );

        newBearingY = Math.sin(longitudeRad - deg.toRadians(newLongitude))
            * Math.cos(latitudeRad);
        newBearingX = Math.cos(newLatitude) * Math.sin(latitudeRad)
            - Math.sin(newLatitude) * Math.cos(latitudeRad)
            * Math.cos(longitudeRad - deg.toRadians(newLongitude));
        newBearing = deg.toDegrees(Math.atan2(newBearingY, newBearingX));
        newBearing = (newBearing + 180) % 360;
        // Conversion to here as these variables are needed in Radians.
        newLatitude = deg.toDegrees(newLatitude);

        if(newLongitude > 180){
            let difference = newLongitude - 180;
            newLongitude = -180 + difference;
        }else if(newLongitude < -180){
            let difference = newLongitude+180;
            newLongitude = difference + 180;
        }

        this.trueBearing = newBearing;
        this.latitude = newLatitude;
        this.longitude = newLongitude;
        console.log(
            "Current Lat/Long:          " + this.latitude.toFixed(2),
            this.longitude.toFixed(2),
        );
        console.log(
            "Current True Bearing:      " + this.trueBearing.toFixed(2),
        ); // console.log(newLatitude,newLongitude);
    }
}
module.exports = MovingObject;
