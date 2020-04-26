
import * as Degrees from "./degrees";

export class MovingObject {
    trueBearing: number;
    latitude: number;
    longitude:number;
    speed: number;
    altitudeFeet: number;

    constructor() {
        this.trueBearing = 75;
        this.latitude = 45;
        this.longitude = -90;
        this.altitudeFeet = 30000;
        this.speed = 200;
    }
    getTrueBearing() {
        return this.trueBearing;
    }
    setTrueBearing(trueBearing:number) {
        this.trueBearing = trueBearing;
    }
    getLatitude() {
        return this.latitude;
    }
    setLatitude(latitude: number) {
        this.latitude = latitude;
    }
    getLongitude() {
        return this.longitude;
    }
    setLongitude(longitude: number) {
        this.longitude = longitude;
    }
    getAltitudeFeet() {
        return this.altitudeFeet;
    }
    setAltitudeFeet(altitudeFeet: number) {
        this.altitudeFeet = altitudeFeet;
    }
    getSpeed() {
        return this.speed;
    }
    setSpeed(speed: number) {
        this.speed = speed;
    }
    move(heartbeatInterval: number) {
        let directionRad = Degrees.toRadians(this.trueBearing);
        let latitudeRad = Degrees.toRadians(this.latitude);
        let longitudeRad = Degrees.toRadians(this.longitude);
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
            + Degrees.toDegrees(
                Math.atan2(
                    Math.sin(directionRad) * Math.sin(funcDistance / 3440)
                        * Math.cos(latitudeRad),
                    Math.cos(funcDistance / 3440) - Math.sin(latitudeRad)
                        * Math.sin(newLatitude),
                ),
            );

        newBearingY = Math.sin(longitudeRad - Degrees.toRadians(newLongitude))
            * Math.cos(latitudeRad);
        newBearingX = Math.cos(newLatitude) * Math.sin(latitudeRad)
            - Math.sin(newLatitude) * Math.cos(latitudeRad)
            * Math.cos(longitudeRad - Degrees.toRadians(newLongitude));
        newBearing = Degrees.toDegrees(Math.atan2(newBearingY, newBearingX));
        newBearing = (newBearing + 180) % 360;
        // Conversion to here as these variables are needed in Radians.
        newLatitude = Degrees.toDegrees(newLatitude);

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

