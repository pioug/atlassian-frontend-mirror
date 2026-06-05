import { DEFAULT_ROUNDING_INTERVAL } from './constants';

/**
 * Returns the number rounded to the nearest interval.
 * @param {number} value    The number to round
 * @param {number} interval The numeric interval to round to, default to 0.5
 * @returns {number} the rounded number
 */
export const roundToNearest = (
	value: number,
	interval: number = DEFAULT_ROUNDING_INTERVAL,
): number => Math.round(value / interval) * interval;
