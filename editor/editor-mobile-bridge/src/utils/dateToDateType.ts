import type { DateType } from '@atlaskit/editor-plugin-date';

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
