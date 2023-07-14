/**
 * A numerical representation of a date:
 *  - year: any positive integer
 *  - month: 1 - 12 (Jan - Dec)
 *  - day: 1 - [28, 29, 30, 31] (depending on month)
 */
export type DateObj = {
  year: number;
  month: number;
  day: number;
};

export const toDateObj = (date: Date): DateObj => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
});

export const toDate = (date: DateObj): Date =>
  // The 'proper' month is stored in a DateObj but Date expects month index
  new Date(date.year, date.month - 1, date.day);

/**
 * Determines if the input year is a leap year
 * See: https://en.wikipedia.org/wiki/Leap_year#Algorithm
 *
 * @param year: integer
 * @returns boolean
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Determines the number of days in specified month on the specified year
 *
 * @param year: number
 * @param month: number
 * @returns number
 */
export const getDaysInMonth = (year: number, month: number): number => {
  // February depends on leap year
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }

  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
};

/**
 * Determines whether or not the specified DateObj will create a valid and
 * logical Date.
 *
 * @param date: DateObj
 * @returns boolean
 */
export const isValid = (date: DateObj): boolean => {
  const { year, month, day } = date;
  const daysInMonth = getDaysInMonth(year, month);

  return 1 <= month && month <= 12 && 1 <= day && day <= daysInMonth;
};

/**
 * Normalizes the specified DateObj, replacing NaN year and zero/NaN month/day
 * with backup values. It also replaces 'short' years (0 - 99) with their 'full'
 * equivalent (2000 - 2099)
 *
 * @param date: DateObj
 * @returns DateObj
 */
export const normalizeDate = (date: DateObj): DateObj => {
  const now = toDateObj(new Date());
  const { year, month, day } = date;

  // 19 should evaluate to 2019
  const fullYear = year < 100 ? 2000 + year : year;

  // Missing date pieces are filled in with their current date values
  const normalizedYear = !isNaN(fullYear) ? fullYear : now.year;
  const normalizedMonth = !isNaN(month) && month !== 0 ? month : now.month;
  const normalizedDay = !isNaN(day) && day !== 0 ? day : now.day;

  return {
    year: normalizedYear,
    month: normalizedMonth,
    day: normalizedDay,
  };
};
