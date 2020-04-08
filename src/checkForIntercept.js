const CheckForIntercept = require("./index.js");

exports.checkForIntercept = function(objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime){
    const intercept = CheckForIntercept.checkForIntercept(
        objTrueBearing, objLatitude, objLongitude, objAltitude, objSpeed, timeNow, daytime);
        return intercept;
}