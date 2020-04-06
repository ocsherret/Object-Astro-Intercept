const SunAstroTimes = require("./sunastrotimes");

exports.getNextSunsetTime = function(time, latitude, longitude, altitude) {
    const sun = new SunAstroTimes(
        time.getTime(),
        latitude,
        longitude,
        altitude
    );
    sun.calcNextSunset(
        time.getTime(),
        latitude,
        longitude,
        altitude
    );
    return sun.getNextSunset();

};