const ProjectedLatLong = require("./index.js");

exports.getProjectedLatLong = function(distanceToPoint, timeToPoint, objTrueBearing, objLatitude, objLongitude, objAltitude, timeNow, daytime) {
    const intercept = ProjectedLatLong.calculateProjectedLatLong(
        distanceToPoint, 
        timeToPoint, 
        objTrueBearing, 
        objLatitude, 
        objLongitude, 
        objAltitude,
        timeNow,
        daytime
    );
    return intercept;

};