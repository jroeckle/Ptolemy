define(["collections/Collection", "models/LunarPhase", "bignumber"],
  function(Collection, LunarPhase, BigNumber) {
    // Creates a new Backbone Collection class object
    var LunarPhases = Collection.extend({
		// Set collection type to LunarPhase model
		model: LunarPhase,
		url : '/data/phases.json',

		/**
		* Helper that gets the currrent Julian Day based on date.
		*
		* Based on calculation by William H. Jefferys : http://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
		*
		* @method getJulianDay
		* @param {Date} The current date.
		* @return {Integer} Returns Julian Day
		*/

		getJulianDay : function(currentDate) {
			if(!this.isDateObject(currentDate)) return false;

			var currentYear  = new BigNumber(currentDate.getFullYear()),
				currentDay   = new BigNumber(currentDate.getDate()),
				currentMonth = new BigNumber(currentDate.getMonth()).plus(1), //zero based counting fix
				julianDate   = new BigNumber(0);

			if(currentMonth.toNumber() <= 2) {
				currentYear  = currentYear.minus(1);
				currentMonth = currentMonth.plus(12);
			}

			var julianA = currentYear.dividedBy(100),
				julianB = new BigNumber(julianA.dividedBy(4).toNumber()),
				julianC = new BigNumber(2).minus(julianA).plus(julianB),
				julianE = new BigNumber(365.25).times(currentYear.plus(4716)),
				julianF = new BigNumber(30.6001).times(currentMonth.plus(1));

			julianDate = julianDate.plus(julianC).plus(currentDay).plus(julianE).plus(julianF).minus(1524.5);

			return julianDate.toNumber();
		},

		/**
		* Checks if object is Date type
		*
		* @method isDateObject
		* @param {Date} A object to evaluated.
		* @return {Boolean} Returns true if Date object.
		*/
		isDateObject : function(date) {
			return (Object.prototype.toString.call(date) === '[object Date]');
		},

		/**
		* Gets the currrent Lunar phase index
		*
		* @method getLunarPhaseByDate
		* @param {Date} The current date.
		* @return {Integer} Returns the index of the current phase
		*/
		getLunarPhaseByDate : function(currentDate) {
			if(!this.isDateObject(currentDate)) return false;

			var that                     = this,
				lastKnownPhase           = new Date("January 6, 2000"),
				lastKnownPhaseJulianDate = new BigNumber(that.getJulianDay(lastKnownPhase)),
				currentPhase             = new BigNumber( new BigNumber(that.getJulianDay(currentDate)).minus(lastKnownPhaseJulianDate) ).modulo(new BigNumber(29.530588853));

			currentPhase = Math.round(currentPhase.dividedBy(new BigNumber(3.69133)).toNumber());

			// Some New Moon Instances will go over
			if(currentPhase >= this.length) currentPhase = 0;

			return currentPhase;
		}

    });

    return LunarPhases;
  });