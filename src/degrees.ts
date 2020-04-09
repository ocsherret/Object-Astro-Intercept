export function degSin(num: number) {
    return Math.sin(this.toRadians(num));
};
export function toRadians(num: number) {
    return num * Math.PI / 180;
};
export function toDegrees(num: number) {
    return num * 180 / Math.PI;
}
export function degCos(num: number) {
    return Math.cos(this.toRadians(num));
}
export function degACos(num: number) {
    return this.toDegrees(Math.acos(num));
}
export function degASin(num: number) {
    return this.toDegrees(Math.asin(num));
}

