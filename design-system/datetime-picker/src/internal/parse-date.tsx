import { format, isValid, parseISO } from 'date-fns';

import { convertTokens } from './parse-tokens';

export function getValidDate(iso: string) {
  const date = parseISO(iso);
  return isValid(date)
    ? {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      }
    : {};
}

export function getShortISOString(date: Date) {
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
