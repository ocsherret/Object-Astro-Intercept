module.exports.degSin = function(num) {
    return Math.sin(this.toRadians(num));
};
module.exports.toRadians = function (num) {
    return num * Math.PI / 180;
};
module.exports.toDegrees = function(num) {
    return num * 180 / Math.PI;
}
module.exports.degSin = function(num) {
    return Math.sin(this.toRadians(num));
}
module.exports.degCos = function(num) {
    return Math.cos(this.toRadians(num));
}
module.exports.degACos = function(num) {
    return this.toDegrees(Math.acos(num));
}
module.exports.degASin = function(num) {
    return this.toDegrees(Math.asin(num));
}

