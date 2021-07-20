import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import isBefore from 'date-fns/isBefore';
import { InjectedIntl } from 'react-intl';

enum FORMATS {
  ISO_FORMAT = 'YYYY-MM-DD',
  CURRENT_YEAR_FORMAT_WITHOUT_YEAR = 'CURRENT_YEAR_FORMAT_WITHOUT_YEAR',
  LOCALIZED_FORMAT = 'LOCALIZED_FORMAT',
}

export interface Date {
  day: number;
  month: number;
  year: number;
}

export const timestampToUTCDate = (timestamp: string | number): Date => {
  const date = new Date(Number(timestamp));
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  return { day, month, year };
};

export const todayTimestampInUTC = (): string => {
  const today = new Date(Date.now());
  const todayInUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return todayInUTC.toString();
};

const addLeadingZero = (val: number) => {
  if (val < 10) {
    return `0${val}`;
  }
  return val;
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// example: "23 Jan 2018"
export const timestampToString = (
  timestamp: string | number,
  intl: InjectedIntl | null,
  pattern?: FORMATS,
): string => {
  if (!intl || pattern === FORMATS.ISO_FORMAT) {
    return timestampToIsoFormat(timestamp);
  }

  const date = new Date(Number(timestamp));

  const showWeekday = pattern === FORMATS.CURRENT_YEAR_FORMAT_WITHOUT_YEAR;
  const showYear = !showWeekday;
  return intl.formatDate(date, {
    timeZone: 'UTC',
    weekday: showWeekday ? 'short' : undefined,
    month: 'short',
    day: 'numeric',
    year: showYear ? 'numeric' : undefined,
    formatMatcher: 'best fit',
  });
};

// example: "2018-01-23"
export const timestampToIsoFormat = (timestamp: string | number): string => {
  const date = new Date(Number(timestamp));
  return `${date.getUTCFullYear()}-${addLeadingZero(
    date.getUTCMonth() + 1,
  )}-${date.getUTCDate()}`;
};

export const isPastDate = (timestamp: string | number): boolean => {
  return isBefore(
    new Date(Number(timestamp)),
    new Date(Number(todayTimestampInUTC())),
  );
};

export const timestampToTaskContext = (
  timestamp: string | number,
  intl: InjectedIntl,
): string => {
  const curDate = new Date(Number(todayTimestampInUTC()));
  const givenDate = new Date(Number(timestamp));
  const distance = differenceInCalendarDays(givenDate, curDate);
  const sameYear = givenDate.getUTCFullYear() === curDate.getUTCFullYear();

  if (intl && [-1, 0, 1].indexOf(distance) > -1) {
    return capitalizeFirstLetter(
      intl.formatRelative(givenDate, {
        units: 'day',
        now: Number(todayTimestampInUTC()),
      }),
    );
  }

  return timestampToString(
    timestamp,
    intl,
    sameYear
      ? FORMATS.CURRENT_YEAR_FORMAT_WITHOUT_YEAR
      : FORMATS.LOCALIZED_FORMAT,
  );
};
