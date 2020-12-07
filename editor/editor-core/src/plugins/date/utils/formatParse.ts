import { createLocalizationProvider } from '@atlaskit/locale';
import { DateType } from '../types';

/**
 * Attempt to parse a string representing a date in a particular locale to a date object
 * @param dateString The string representing the date in the given locale, eg '02/12/2000'
 * @param l10n The localisation provider created by createLocalizationProvider
 * @returns Editor DateType when can parse, null when can't parse or invalid
 */
export function parseDateType(
  dateString: string,
  locale: string,
): DateType | null {
  try {
    const l10n = createLocalizationProvider(locale);
    const date = l10n.parseDate(dateString);

    // If date is invalid
    if (isNaN(date.getTime())) {
      return null;
    }
    const year = date.getFullYear();

    if (year < 1000 || year > 9999) {
      return null;
    }

    const dateObj = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year,
    };
    return dateObj;
  } catch (e) {
    return null;
  }
}

/**
 * Convert an EditorDateType to a date string string formatted for a particular locale
 * @param date The date object
 * @param locale The locale code string (eg. "en-AU")
 * @returns Date string, eg "25/5/20"
 */
export function formatDateType(date: DateType, locale: string): string {
  const { day, month, year } = date;
  const l10n = createLocalizationProvider(locale);

  // The JS Date api represents month as a number between 0-11 :)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
  const dateObj = new Date(year, month - 1, day);

  return l10n.formatDate(dateObj);
}

/**
 * Convert an Editor DateType to a JavaScript Date object
 * @param date Editor DateType
 * @returns JavaScript Date object
 */
export function dateTypeToDate(date: DateType): Date {
  const { day, month, year } = date;
  // The JS Date api represents month as a number between 0-11 :)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
  const dateObj = new Date(year, month - 1, day);
  return dateObj;
}

/**
 * Convert a JavaScript Date to an editor DateType
 * @param date JavaScript Date object
 * @returns Editor DateType
 */
export function dateToDateType(date: Date): DateType {
  const dateObj = {
    day: date.getDate(),
    // The JS Date api represents month as a number between 0-11 :)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
  return dateObj;
}
