import * as Degrees from "./degrees"

// All sun calcs are done using a date datum of 01 JAN 2000 @ 1200Zulu
// Formulas used calculate using days, which is 86400000 milliseconds
const dateDatum = new Date("2000-01-01T12:00:00Z").getTime();
const oneSecond = 1000;
const oneMinute = 60000;
const oneHour = 3600000;
const oneDay = 86400000;

export class SunAstroTimes {
    date: number;
    latitude: number;
    longitude: number;
    altitudeFeet: number;
    todaysDate: Date;
    localDayNum: number;
    julianDateNow: number;
    meanSolarNoon: number;
    solarMeanAnomaly: number;
    equationOfTheCentre: number;
    eclipticLongitude: number;
    solarTransit: number;
    solarDeclination: number;
    solarNoon: number;
    sunrise: number;
    sunset: number;
    nextSunrise: number;
    nextSunset: number;

    constructor(date:number, latitude:number, longitude:number, altitude:number) {
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitudeFeet = altitude;
        this.calcSolarNoon();
       // this.calcAstronomicalTwilight();
       // this.calcNauticalTwilight();
       
        this.calcSunlight();
        //this.calcLCLMidnight();
        //this.calcSolarMidnight();
    }
    reCalcTimes(date:number, latitude:number, longitude:number, altitude:number) {
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitudeFeet = altitude;
        this.calcSolarNoon();   
        this.calcSunlight();
       
    }
    calcSolarNoon() {
        // All sunrise/sunset calculations are based on 01 JAN 2000 @ 1200Z
        // Have to divide the time by 86400000 to do all fomulas based on Days since the datum
        this.todaysDate = new Date(this.date);
        this.localDayNum = new Date(
            `${this.todaysDate.getUTCMonth() + 1}/${this.todaysDate.getUTCDate()
            }/${this.todaysDate.getUTCFullYear()} 12:00:00Z`,
        ).getTime();
        this.julianDateNow = 
            (this.localDayNum - dateDatum) / 86400000;

        this.meanSolarNoon = this.julianDateNow - (this.longitude / 360);
        this.solarMeanAnomaly =
            (357.5291 + (0.98560028 * this.meanSolarNoon)) % 360;
        this.equationOfTheCentre = 1.9148
            * Degrees.degSin(this.solarMeanAnomaly)
            + 0.02 * Degrees.degSin(2 * this.solarMeanAnomaly)
            + 0.0003 * Degrees.degSin(3 * this.solarMeanAnomaly);
        this.eclipticLongitude =
            (this.solarMeanAnomaly + this.equationOfTheCentre + 180 + 102.9372)
                % 360;
        this.solarTransit = this.meanSolarNoon + 0.0053
            * Degrees.degSin(this.solarMeanAnomaly) - 0.0069
            * Degrees.degSin(2 * this.eclipticLongitude);
        this.solarDeclination = Degrees.degASin(
            Degrees.degSin(this.eclipticLongitude) * Degrees.degSin(23.44),
        );
        this.solarNoon = (this.solarTransit * 86400000) + dateDatum;
    }    
    calcSunlight() {
        // Using the generally accepted number of -0.83 degrees for when the top of
        // the sun goes below the horizon.
        const hourAngle = Degrees.degACos(
            ((Degrees.degSin(-0.83 + (-1.15 * (Math.sqrt(this.altitudeFeet) / 60)))
                - Degrees.degSin(this.latitude) * Degrees.degSin(this.solarDeclination))
                / (Degrees.degCos(this.latitude)
                    * Degrees.degCos(this.solarDeclination))),
        );
        this.sunrise = dateDatum + (this.solarTransit - hourAngle / 360)
            * 86400000;
        this.sunset = dateDatum + (this.solarTransit + hourAngle / 360)
            * 86400000;
    }
    calcNextSunrise(time:number, latitude:number, longitude:number, altitude:number) {
        this.nextSunrise = null;
        this.reCalcTimes(
            time,
            latitude,
            longitude,
            altitude
        )
        if(time < this.sunrise && this.sunrise < (time+oneDay)){
            this.nextSunrise = this.sunrise;
        } else if(time > this.sunrise){
            let i = 1;
            do{
                this.reCalcTimes(
                    time+i*oneDay,
                    latitude,
                    longitude,
                    altitude
                )
                i++;
            } while(time > this.sunrise);
            this.nextSunrise = this.sunrise;
            
        } else if (this.sunrise > (time+oneDay)){
            let i = 1;
            do{
                this.reCalcTimes(
                    time+i*oneDay, 
                    latitude,
                    longitude,
                    altitude
                )
                i--;
            } while(this.sunrise > (time+oneDay));
            this.nextSunrise = this.sunrise;
        } else{
            this.nextSunrise = this.sunrise;
        }
        return this.nextSunrise;
    }
    calcNextSunset(time:number, latitude:number, longitude:number, altitude:number) {
        this.nextSunset = null;
        this.reCalcTimes(
            time,
            latitude,
            longitude,
            altitude
        )
        if(time < this.sunset && this.sunset < (time+oneDay)){
            this.nextSunset = this.sunset;
        } else if(time > this.sunset){
            let i = 0;
            do{
                this.reCalcTimes(
                    time+i*oneDay,
                    latitude,
                    longitude,
                    altitude
                )
                i++;
            } while(time > this.sunset);
            this.nextSunset = this.sunset;
            
        } else if (this.sunset > (time+oneDay)){
            let i = 1;
            do{
                this.reCalcTimes(
                    time+i*oneDay,
                    latitude,
                    longitude,
                    altitude
                )
                i--;
            } while(this.sunset > (time+oneDay)&& i > -1);
            this.nextSunset = this.sunset;
        } else{
            this.nextSunset = this.sunset;
        }
        return this.nextSunset;
    }
    getNextSunset() {
        return this.nextSunset;
    }
    getNextSunrise() {
        return this.nextSunrise;
    }
    
    getSunset() {
        return this.sunset;
    }
    getSunrise(){
        return this.sunrise;
    }

}

