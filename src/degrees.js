class Degrees {
    constructor() {}

    degSin(num) {
        return Math.sin(this.toRadians(num));
    }

    degCos(num) {
        return Math.cos(this.toRadians(num));
    }

    degACos(num) {
        return this.toDegrees(Math.acos(num));
    }
    degASin(num) {
        return this.toDegrees(Math.asin(num));
    }

    toRadians(num) {
        return num * Math.PI / 180;
    }
    toDegrees(num) {
        return num * 180 / Math.PI;
    }
}
module.exports = Degrees;
