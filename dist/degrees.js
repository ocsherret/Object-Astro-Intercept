"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function degSin(num) {
    return Math.sin(this.toRadians(num));
}
exports.degSin = degSin;
;
function toRadians(num) {
    return num * Math.PI / 180;
}
exports.toRadians = toRadians;
;
function toDegrees(num) {
    return num * 180 / Math.PI;
}
exports.toDegrees = toDegrees;
function degCos(num) {
    return Math.cos(this.toRadians(num));
}
exports.degCos = degCos;
function degACos(num) {
    return this.toDegrees(Math.acos(num));
}
exports.degACos = degACos;
function degASin(num) {
    return this.toDegrees(Math.asin(num));
}
exports.degASin = degASin;
