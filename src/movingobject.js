class MovingObject{
    constructor(){
        this.trueBearing = 70;
        this.latitude = 43;
        this.longitude = -79;
        this.altitudeFeet = 30000;
        this.speed = 120;
    }
    getTrueBearing(){
        return this.trueBearing;
    }
    setTrueBearing(trueBearing){
        this.trueBearing = trueBearing;
    }
    getLatitude(){
        return this.latitude;
    }
    setLatitude(latitude){
        this.latitude = latitude;
    }
    getLongitude(){
        return this.longitude;
    }
    setLongitude(longitude){
        this.longitude = longitude;
    }
    getAltitudeFeet(){
        return this.altitudeFeet
    }
    setAltitudeFeet(altitudeFeet){
        this.altitudeFeet = altitudeFeet;
    }
    getSpeed(){
        return this.speed;
    }
    setSpeed(speed){
        this.speed = speed;
    }
}
module.exports = MovingObject;