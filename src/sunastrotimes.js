const Degrees = require("./degrees");
const deg = new Degrees();
// All sun calcs are done using a date datum of 01 JAN 2000 @ 1200Zulu
// Formulas used calculate using days, which is 86400000 milliseconds
const dateDatum = new Date("2000-01-01T12:00:00Z").getTime();

class SunAstroTimes {
    constructor(date, latitude, longitude, altitude) {
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitudeFeet = altitude;
        this.calcSolarNoon();
        this.calcAstronomicalTwilight();
        this.calcNauticalTwilight();
        this.calcCivilTwilight();
        this.calcSunlight();
        this.calcLCLMidnight();
        this.calcSolarMidnight();
    }
    reCalcTimes(date, latitude, longitude, altitude) {
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitudeFeet = altitude;
        this.calcSolarNoon();
        this.calcAstronomicalTwilight();
        this.calcNauticalTwilight();
        this.calcCivilTwilight();
        this.calcSunlight();
        this.calcLCLMidnight();
        this.calcSolarMidnight();
    }
    calcSolarNoon() {
        // All sunrise/sunset calculations are based on 01 JAN 2000 @ 1200Z
        // Have to divide the time by 86400000 to do all fomulas based on Days since the datum
        this.todaysDate = new Date(this.date);
        const offsetCheck = this.todaysDate.getHours()
            + Math.floor(this.longitude / 15)
            + (this.todaysDate.getTimezoneOffset() / 60);
        this.localDayNum = new Date(
            `${this.todaysDate.getMonth() + 1}/${this.todaysDate.getDate()
                + 1}/${this.todaysDate.getFullYear()} 12:00:00Z`,
        ).getTime();

        this.julianDateNow = Math.round(
            (this.localDayNum - dateDatum) / 86400000,
        );
        this.meanSolarNoon = this.julianDateNow - (this.longitude / 360);
        this.solarMeanAnomaly =
            (357.5291 + (0.98560028 * this.meanSolarNoon)) % 360;
        this.equationOfTheCentre = 1.9148
            * deg.degSin(this.solarMeanAnomaly)
            + 0.02 * deg.degSin(2 * this.solarMeanAnomaly)
            + 0.0003 * deg.degSin(3 * this.solarMeanAnomaly);
        this.eclipticLongitude =
            (this.solarMeanAnomaly + this.equationOfTheCentre + 180 + 102.9372)
                % 360;
        this.solarTransit = this.meanSolarNoon + 0.0053
            * deg.degSin(this.solarMeanAnomaly) - 0.0069
            * deg.degSin(2 * this.eclipticLongitude);
        this.solarDeclination = deg.degASin(
            deg.degSin(this.eclipticLongitude) * deg.degSin(23.44),
        );
        this.solarNoon = (this.solarTransit * 86400000) + dateDatum;
    }
    calcLCLMidnight() {
        this.todaysDate = new Date(this.date);
        this.localMidnight = new Date(
            `${this.todaysDate.getMonth() + 1}/${this.todaysDate
                .getDate()}/${this.todaysDate.getFullYear()} 23:59:59`,
        ).getTime();
    }

    calcAstronomicalTwilight() {
        // Astronomical twilight is when the suns centre is -18 degrees below the horizon.
        const hourAngle = deg.degACos(
            ((deg.degSin(-18 + (-1.15 * (Math.sqrt(this.altitudeFeet) / 60)))
                - deg.degSin(this.latitude) * deg.degSin(this.solarDeclination))
                / (deg.degCos(this.latitude)
                    * deg.degCos(this.solarDeclination))),
        );

        this.astronomicalTwilightRise = dateDatum
            + (this.solarTransit - hourAngle / 360) * 86400000;
        this.astronomicalTwilightSet = dateDatum
            + (this.solarTransit + hourAngle / 360) * 86400000;
    }
    calcNauticalTwilight() {
        // Nautical twilight is when the suns centre is -12 degrees below the horizon.
        const hourAngle = deg.degACos(
            ((deg.degSin(-12 + (-1.15 * (Math.sqrt(this.altitudeFeet) / 60)))
                - deg.degSin(this.latitude) * deg.degSin(this.solarDeclination))
                / (deg.degCos(this.latitude)
                    * deg.degCos(this.solarDeclination))),
        );
        this.nauticalTwilightRise = dateDatum
            + (this.solarTransit - hourAngle / 360) * 86400000;
        this.nauticalTwilightSet = dateDatum
            + (this.solarTransit + hourAngle / 360) * 86400000;
    }
    calcCivilTwilight() {
        // Civil twilight is when the suns centre is -6 degrees below the horizon.
        const hourAngle = deg.degACos(
            ((deg.degSin(-6 + (-1.15 * (Math.sqrt(this.altitudeFeet) / 60)))
                - deg.degSin(this.latitude) * deg.degSin(this.solarDeclination))
                / (deg.degCos(this.latitude)
                    * deg.degCos(this.solarDeclination))),
        );
        this.civilTwilightRise = dateDatum
            + (this.solarTransit - hourAngle / 360) * 86400000;
        this.civilTwilightSet = dateDatum
            + (this.solarTransit + hourAngle / 360) * 86400000;
    }
    calcSunlight() {
        // Using the generally accepted number of -0.83 degrees for when the top of
        // the sun goes below the horizon.
        const hourAngle = deg.degACos(
            ((deg.degSin(-0.83 + (-1.15 * (Math.sqrt(this.altitudeFeet) / 60)))
                - deg.degSin(this.latitude) * deg.degSin(this.solarDeclination))
                / (deg.degCos(this.latitude)
                    * deg.degCos(this.solarDeclination))),
        );
        this.sunRise = dateDatum + (this.solarTransit - hourAngle / 360)
            * 86400000;
        this.sunSet = dateDatum + (this.solarTransit + hourAngle / 360)
            * 86400000;
    }
    calcNextSunrise(date, latitude, longitude, altitude) {
        this.date = date;
        const timeNow = date;
        let i = 0;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitudeFeet = altitude;
        do {
            this.date = this.date + i * 86400000;
            this.calcSolarNoon();
            const hourAngle = deg.degACos(
                ((deg.degSin(
                    -0.83 + (-1.15 * (Math.sqrt(this.altitudeFeet) / 60)),
                )
                    - deg.degSin(this.latitude)
                    * deg.degSin(this.solarDeclination))
                    / (deg.degCos(this.latitude)
                        * deg.degCos(this.solarDeclination))),
            );
            this.sunRise = dateDatum + (this.solarTransit - hourAngle / 360)
                * 86400000;
            i++;
        } while (this.sunRise < timeNow && i < 2);
    }
    calcNextSunset(date, latitude, longitude, altitude) {
        this.date = date;
        const timeNow = date;
        let i = 0;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitudeFeet = altitude;
        do {
            this.date = this.date + i * 86400000;
            this.calcSolarNoon();
            const hourAngle = deg.degACos(
                ((deg.degSin(
                    -0.83 + (-1.15 * (Math.sqrt(this.altitudeFeet) / 60)),
                )
                    - deg.degSin(this.latitude)
                    * deg.degSin(this.solarDeclination))
                    / (deg.degCos(this.latitude)
                        * deg.degCos(this.solarDeclination))),
            );
            this.sunSet = dateDatum + (this.solarTransit + hourAngle / 360)
                * 86400000;
            i++;
        } while (this.sunSet < timeNow && i < 4);

        if ((this.sunSet - this.date) > 86400000) {
            this.date = this.date - Math.floor((this.sunSet-this.date)/ 86400000)* 86400000;
            this.calcSolarNoon();
            const hourAngle = deg.degACos(
                ((deg.degSin(
                    -0.83 + (-1.15 * (Math.sqrt(this.altitudeFeet) / 60)),
                )
                    - deg.degSin(this.latitude)
                    * deg.degSin(this.solarDeclination))
                    / (deg.degCos(this.latitude)
                        * deg.degCos(this.solarDeclination))),
            );
            this.sunSet = dateDatum + (this.solarTransit + hourAngle / 360)
                * 86400000;
        }
    
    }

    calcSolarMidnight() {
        // Adds 12 hours to current solar transit/noon.
        this.solarMidnight = this.solarNoon + 43200000;
    }
    getAstronomicalRise() {
        return this.astronomicalTwilightRise;
    }
    getAstronomicalSet() {
        return this.astronomicalTwilightSet;
    }
    getNauticalRise() {
        return this.nauticalTwilightRise;
    }
    getNauticalSet() {
        return this.nauticalTwilightSet;
    }
    getCivilRise() {
        return this.civilTwilightRise;
    }
    getCivilSet() {
        return this.civilTwilightSet;
    }
    getSunrise() {
        return this.sunRise;
    }
    getSunset() {
        return this.sunSet;
    }
    getLCLMidnight() {
        return this.localMidnight;
    }
    getSolarMidnight() {
        return this.solarMidnight;
    }
    getSolarNoon() {
        return this.solarNoon;
    }
}

module.exports = SunAstroTimes;
