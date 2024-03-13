import { format } from 'date-fns';

import { convertTokens } from './parse-tokens';

/**
 * Converts a Date object into an ISO date, formatted `YYYY-MM-DD`.
 *
 * @param date The date to convert.
 * @returns An ISO date (`YYYY-MM-DD`).
 */
export function getShortISOString(date: Date): string {
  return format(date, convertTokens('YYYY-MM-DD'));
}

export function getSafeCalendarValue(calendarValue: string): string {
  // If `calendarValue` has a year that is greater than 9999, default to
  // today's date
  const yearIsOverLimit = calendarValue.match(/^\d{5,}/);
  if (yearIsOverLimit) {
    return getShortISOString(new Date());
  }
  return calendarValue;
}
