const SunAstroTimes = require("./sunastrotimes");

exports.getNextSunriseTime = function(time, latitude, longitude, altitude) {
    const sun = new SunAstroTimes(
        time.getTime(),
        latitude,
        longitude,
        altitude
    );
    sun.calcNextSunrise(
        time.getTime(),
        latitude,
        longitude,
        altitude
    );
    return sun.getNextSunrise();

};