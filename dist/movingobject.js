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
var MovingObject = /** @class */ (function () {
    function MovingObject() {
        this.trueBearing = 75;
        this.latitude = 45;
        this.longitude = -79;
        this.altitudeFeet = 30000;
        this.speed = 600;
    }
    MovingObject.prototype.getTrueBearing = function () {
        return this.trueBearing;
    };
    MovingObject.prototype.setTrueBearing = function (trueBearing) {
        this.trueBearing = trueBearing;
    };
    MovingObject.prototype.getLatitude = function () {
        return this.latitude;
    };
    MovingObject.prototype.setLatitude = function (latitude) {
        this.latitude = latitude;
    };
    MovingObject.prototype.getLongitude = function () {
        return this.longitude;
    };
    MovingObject.prototype.setLongitude = function (longitude) {
        this.longitude = longitude;
    };
    MovingObject.prototype.getAltitudeFeet = function () {
        return this.altitudeFeet;
    };
    MovingObject.prototype.setAltitudeFeet = function (altitudeFeet) {
        this.altitudeFeet = altitudeFeet;
    };
    MovingObject.prototype.getSpeed = function () {
        return this.speed;
    };
    MovingObject.prototype.setSpeed = function (speed) {
        this.speed = speed;
    };
    MovingObject.prototype.move = function (heartbeatInterval) {
        var directionRad = Degrees.toRadians(this.trueBearing);
        var latitudeRad = Degrees.toRadians(this.latitude);
        var longitudeRad = Degrees.toRadians(this.longitude);
        var newLatitude = this.latitude;
        var newLongitude = this.longitude;
        var newBearing = this.trueBearing;
        var newBearingY = null;
        var newBearingX = null;
        var funcDistance = this.speed * (heartbeatInterval / 3600000);
        newLatitude = Math.asin(Math.sin(latitudeRad) * Math.cos(funcDistance / 3440)
            + Math.cos(latitudeRad) * Math.sin(funcDistance / 3440)
                * Math.cos(directionRad));
        newLongitude = this.longitude
            + Degrees.toDegrees(Math.atan2(Math.sin(directionRad) * Math.sin(funcDistance / 3440)
                * Math.cos(latitudeRad), Math.cos(funcDistance / 3440) - Math.sin(latitudeRad)
                * Math.sin(newLatitude)));
        newBearingY = Math.sin(longitudeRad - Degrees.toRadians(newLongitude))
            * Math.cos(latitudeRad);
        newBearingX = Math.cos(newLatitude) * Math.sin(latitudeRad)
            - Math.sin(newLatitude) * Math.cos(latitudeRad)
                * Math.cos(longitudeRad - Degrees.toRadians(newLongitude));
        newBearing = Degrees.toDegrees(Math.atan2(newBearingY, newBearingX));
        newBearing = (newBearing + 180) % 360;
        // Conversion to here as these variables are needed in Radians.
        newLatitude = Degrees.toDegrees(newLatitude);
        if (newLongitude > 180) {
            var difference = newLongitude - 180;
            newLongitude = -180 + difference;
        }
        else if (newLongitude < -180) {
            var difference = newLongitude + 180;
            newLongitude = difference + 180;
        }
        this.trueBearing = newBearing;
        this.latitude = newLatitude;
        this.longitude = newLongitude;
        console.log("Current Lat/Long:          " + this.latitude.toFixed(2), this.longitude.toFixed(2));
        console.log("Current True Bearing:      " + this.trueBearing.toFixed(2)); // console.log(newLatitude,newLongitude);
    };
    return MovingObject;
}());
exports.MovingObject = MovingObject;
