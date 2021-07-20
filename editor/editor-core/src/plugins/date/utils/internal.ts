import { formatDateType, dateTypeToDate, dateToDateType } from './formatParse';
import { DateType } from '../types';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import addYears from 'date-fns/addYears';

import { DateSegment } from '../types';

export function padToTwo(number: number) {
  return number <= 99 ? `0${number}`.slice(-2) : `${number}`;
}

function isDigit(c: string): boolean {
  if (c === undefined) {
    return false;
  }
  return c >= '0' && c <= '9';
}

/**
 * Check if cursor is in first segment of a date.
 * @param cursorPos Cursor pos, with 0 referring to the left of first char
 * @param date Date string in any locale
 */
function isCursorInFirstDateSegment(cursorPos: number, date: string): boolean {
  let posCounter = cursorPos - 1;
  let isAdjacent = true;
  // The date without any non-digit characters on the end
  const strippedDate = date.replace(/[^0-9]+$/g, '');
  while (posCounter >= 0 && isAdjacent) {
    const c = strippedDate[posCounter];

    if (!isDigit(c)) {
      isAdjacent = false;
    }
    posCounter -= 1;
  }
  return isAdjacent;
}

/**
 * Check if cursor is in last segment of a date.
 * @param cursorPos Cursor pos, with 0 referring to the left of first char
 * @param date Date string in any locale
 */
function isCursorInLastDateSegment(cursorPos: number, date: string): boolean {
  let posCounter = cursorPos;
  let isAdjacent = true;
  // The date without any non-digit characters on the end
  const strippedDate = date.replace(/[^0-9]+$/g, '');
  while (posCounter < strippedDate.length && isAdjacent) {
    const c = strippedDate[posCounter];
    if (!isDigit(c)) {
      isAdjacent = false;
    }
    posCounter += 1;
  }
  return isAdjacent;
}

/**
 * Inconclusively check if a date string is valid - a value of false means it is definitely
 * invalid, a value of true means it might be valid.
 * @param date Date string to be parsed
 */
export function isDatePossiblyValid(date: string): boolean {
  for (const c of date) {
    const isNumber = c >= '0' && c <= '9';
    const isValidPunctuation = '. ,/'.indexOf(c) !== -1;
    if (!(isNumber || isValidPunctuation)) {
      return false;
    }
  }
  return true;
}

/**
 * Find the segment of a date a position refers to. Eg: pos 2 in 29/03/2020 is in
 * the day segment.
 * @param position Cursor position, with 0 referring to the left of the first char
 * @param date The localised date string
 * @param locale The language to interpret the date string in
 */
export function findDateSegmentByPosition(
  position: number,
  date: string,
  locale: string,
): DateSegment | undefined {
  if (position > date.length) {
    return undefined;
  }
  const placeholder = getLocaleDatePlaceholder(locale);
  if (!placeholder) {
    return undefined;
  }

  // The placeholder without any non-digit characters on the end
  const strippedPlaceholder = placeholder.replace(/[^ymd]+$/g, '');

  const keyToSegment: { [id: string]: DateSegment } = {
    d: 'day',
    m: 'month',
    y: 'year',
  };

  const firstSegment: DateSegment = keyToSegment[strippedPlaceholder[0]];
  const lastSegment: DateSegment =
    keyToSegment[strippedPlaceholder[strippedPlaceholder.length - 1]];
  const allPossibleSegments: DateSegment[] = ['day', 'month', 'year'];
  const middleSegment: DateSegment = allPossibleSegments.filter(
    (s) => s !== firstSegment && s !== lastSegment,
  )[0];

  if (isCursorInFirstDateSegment(position, date)) {
    return firstSegment;
  }
  if (isCursorInLastDateSegment(position, date)) {
    return lastSegment;
  }
  return middleSegment;
}

/**
 * Generate a placeholder date string for a given locale
 * eg: locale 'hu-HU' -> 'yyyy. mm. dd.'
 * @param locale A locale string supported by Intl.DateTimeFormat
 * @returns A placeholder string. d=1 or 2 digit day, dd=zero padded
 * day, same for month but letter m, yyyy=year
 */
export function getLocaleDatePlaceholder(locale: string): string | undefined {
  const uniqueDateType: DateType = {
    day: 7,
    month: 1,
    year: 1992,
  };

  const localisedDateString = formatDateType(uniqueDateType, locale);

  const shortDateFormat = localisedDateString.replace(
    /\d+/g,
    (str: string): string => {
      if (!str) {
        return '';
      }
      var num = parseInt(str);
      switch (num % 100) {
        case 92:
          return str.replace(/.{1}/g, 'y');
        case 1:
          return str.length === 1 ? 'm' : 'mm';
        case 7:
          return str.length === 1 ? 'd' : 'dd';
      }
      return '';
    },
  );
  return shortDateFormat;
}

/**
 * Adjust date segment up or down. Eg. If day is the active segment and adjustment is -1,
 * reduce the day by one.
 * @param date Valid datetype
 * @param activeSegment which part of the date is selected/being adjusted
 * @param adjustment how many units the segment is being adjusted (can be pos or neg, usually 1 or -1)
 */
export function adjustDate(
  date: DateType,
  activeSegment: DateSegment,
  adjustment: number,
): DateType {
  const originalDate: Date = dateTypeToDate(date);

  const newDate: Date =
    activeSegment === 'day'
      ? addDays(originalDate, adjustment)
      : activeSegment === 'month'
      ? addMonths(originalDate, adjustment)
      : addYears(originalDate, adjustment);

  return dateToDateType(newDate);
}

export function isToday(date: DateType | undefined) {
  const today = new Date();
  return (
    date !== undefined &&
    today.getDate() === date.day &&
    date.month === today.getMonth() + 1 &&
    date.year === today.getFullYear()
  );
}
