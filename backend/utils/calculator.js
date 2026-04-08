const { differenceInDays, isWithinInterval, startOfDay, endOfDay, eachDayOfInterval, subDays, isSameDay } = require('date-fns');

/**
 * Core Calculator for Nomad-Tax Residency
 */
class TaxCalculator {
  /**
   * Calculates the total days spent in a country within a specific window.
   * @param {Array} stays - Array of stay objects { arrivalDate, departureDate, countryCode }
   * @param {string} countryCode - The country to check
   * @param {Date} windowStart - Start of the calculation window
   * @param {Date} windowEnd - End of the calculation window
   * @returns {number} - Total days spent
   */
  static calculateDaysInWindow(stays, countryCode, windowStart, windowEnd) {
    let totalDays = 0;
    const targetStays = stays.filter(s => s.countryCode === countryCode);

    targetStays.forEach(stay => {
      const start = new Date(Math.max(new Date(stay.arrivalDate), windowStart));
      const end = new Date(Math.min(new Date(stay.departureDate), windowEnd));

      if (start <= end) {
        // We add 1 because both arrival and departure days usually count
        totalDays += differenceInDays(end, start) + 1;
      }
    });

    return totalDays;
  }

  /**
   * Specifically for the Schengen 90/180 rule.
   * Checks if any day in the proposed stay would violate the 90/180 rule.
   * @param {Array} pastStays - Array of existing stays in the Schengen area
   * @param {Date} arrivalDate - Proposed arrival
   * @param {Date} departureDate - Proposed departure
   * @returns {Object} - { isValid: boolean, violationDate: Date | null, maxStayAllowed: number }
   */
  static checkSchengenCompliance(pastStays, arrivalDate, departureDate) {
    const SCHENGEN_WINDOW = 180;
    const SCHENGEN_LIMIT = 90;

    // Create a set of all past days spent in Schengen
    const spentDays = new Set();
    pastStays.filter(s => s.countryCode === 'SCH').forEach(stay => {
      const range = eachDayOfInterval({
        start: startOfDay(new Date(stay.arrivalDate)),
        end: startOfDay(new Date(stay.departureDate))
      });
      range.forEach(d => spentDays.add(d.toISOString()));
    });

    // Check each day of the proposed stay
    const proposedRange = eachDayOfInterval({
      start: startOfDay(new Date(arrivalDate)),
      end: startOfDay(new Date(departureDate))
    });

    for (const day of proposedRange) {
      // For this day, look back 180 days
      let count = 0;
      const lookbackStart = subDays(day, SCHENGEN_WINDOW - 1);
      const lookbackRange = eachDayOfInterval({ start: lookbackStart, end: day });

      lookbackRange.forEach(d => {
        const dIso = d.toISOString();
        if (spentDays.has(dIso) || isWithinInterval(d, { start: startOfDay(arrivalDate), end: startOfDay(day) })) {
          count++;
        }
      });

      if (count > SCHENGEN_LIMIT) {
        return {
          isValid: false,
          violationDate: day,
          currentDayCount: count
        };
      }
    }

    return { isValid: true, violationDate: null };
  }
}

module.exports = TaxCalculator;
