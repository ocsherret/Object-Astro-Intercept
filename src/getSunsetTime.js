const SunAstroTimes = require("./sunastrotimes");

exports.getSunsetTime = function(time, latitude, longitude, altitude) {
    const sun = new SunAstroTimes(
        time,
        latitude,
        longitude,
        altitude
    );
    
    return sun.getSunset()

};
