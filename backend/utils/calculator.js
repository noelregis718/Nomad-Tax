const { differenceInDays, isWithinInterval, startOfDay, endOfDay, eachDayOfInterval, subDays, isSameDay, subYears, startOfYear, endOfYear } = require('date-fns');
const rules = require('./rules.json');

/**
 * Core Calculator for Nomad-Tax Residency
 */
class TaxCalculator {
  /**
   * Calculates the total days spent in a country within a specific window.
   * Handles specialized logic (Weighted, Midnight, 24h) based on rules.json
   * @param {Array} stays - Array of stay objects
   * @param {string} countryCode - ISO Code
   * @param {Date} windowStart - Calculation start
   * @param {Date} windowEnd - Calculation end
   * @returns {number} - Effective days for residency
   */
  static calculateDaysInWindow(stays, countryCode, windowStart, windowEnd) {
    const rule = rules[countryCode] || rules.GLOBAL_DEFAULT;
    
    // Branch logic based on rule type
    if (rule.logic === 'WEIGHTED_3_YEAR' && countryCode === 'USA') {
      return this.calculateUSSubstantialPresence(stays, windowEnd);
    }

    let totalDays = 0;
    const targetStays = stays.filter(s => s.countryCode === countryCode);

    targetStays.forEach(stay => {
      const stayStart = new Date(stay.arrivalDate);
      const stayEnd = new Date(stay.departureDate);
      
      const start = new Date(Math.max(stayStart, windowStart));
      const end = new Date(Math.min(stayEnd, windowEnd));

      if (start <= end) {
        let days = differenceInDays(end, start) + 1;

        // Apply specialized counting logic
        if (rule.logic === 'MIDNIGHT_COUNT') {
          // UK/Midnight logic: Usually days - 1 (arrival doesn't count if after midnight, departure does)
          days = Math.max(0, days - 1);
        } else if (rule.logic === 'FULL_24H_ONLY') {
          // China logic: Only full days count. Stays of 1-5 = 3 full days (2, 3, 4).
          days = Math.max(0, days - 2);
        }
        
        totalDays += days;
      }
    });

    return totalDays;
  }

  /**
   * Specialized logic for US Substantial Presence Test
   * Formula: (Current Year Days) + (1/3 Last Year Days) + (1/6 2-Years Ago Days)
   */
  static calculateUSSubstantialPresence(stays, targetDate) {
    const currentYear = targetDate.getFullYear();
    
    const countForYear = (year) => {
      const start = startOfYear(new Date(year, 0, 1));
      const end = endOfYear(new Date(year, 0, 1));
      let days = 0;
      stays.filter(s => s.countryCode === 'USA').forEach(stay => {
        const sStart = new Date(Math.max(new Date(stay.arrivalDate), start));
        const sEnd = new Date(Math.min(new Date(stay.departureDate), end));
        if (sStart <= sEnd) days += differenceInDays(sEnd, sStart) + 1;
      });
      return days;
    };

    const daysThisYear = countForYear(currentYear);
    const daysLastYear = countForYear(currentYear - 1);
    const daysTwoYearsAgo = countForYear(currentYear - 2);

    return Math.round(daysThisYear + (daysLastYear / 3) + (daysTwoYearsAgo / 6));
  }

  /**
   * Helper to get rules from registry
   */
  static getRule(countryCode) {
    return rules[countryCode] || rules.GLOBAL_DEFAULT;
  }

  /**
   * Specifically for Russia (Rolling 12M logic)
   * Russia requires 183 days in any 12-month period.
   */
  static calculateRollingDays(stays, countryCode, targetDate) {
    const windowEnd = endOfDay(targetDate);
    const windowStart = startOfDay(subDays(windowEnd, 364)); // 365 days total
    return this.calculateDaysInWindow(stays, countryCode, windowStart, windowEnd);
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
