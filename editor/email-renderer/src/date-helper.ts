import isBefore from 'date-fns/is_before';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

const ISO_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT = 'DD MMM YYYY';

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
  const today = new Date();
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

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const week_days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// example: "23 Jan 2018"
export const timestampToString = (
  timestamp: string | number,
  pattern?: string,
): string => {
  const date = new Date(Number(timestamp));
  switch (pattern) {
    case 'ddd, DD MMM':
      return `${week_days[date.getUTCDay()]}, ${addLeadingZero(
        date.getUTCDate(),
      )} ${months[date.getUTCMonth()]}`;
    case ISO_FORMAT:
      return `${date.getUTCFullYear()}-${addLeadingZero(
        date.getUTCMonth() + 1,
      )}-${date.getUTCDate()}`;
    default:
      return `${addLeadingZero(date.getUTCDate())} ${
        months[date.getUTCMonth()]
      } ${date.getUTCFullYear()}`;
  }
};

// example: "2018-01-23"
export const timestampToIsoFormat = (timestamp: string | number): string => {
  return timestampToString(timestamp, ISO_FORMAT);
};

export const isPastDate = (timestamp: string | number): boolean => {
  return isBefore(
    timestampToIsoFormat(Number(timestamp)),
    timestampToIsoFormat(new Date().valueOf()),
  );
};

export const timestampToTaskContext = (timestamp: string | number): string => {
  const curDate = new Date();
  const givenDate = new Date(Number(timestamp));
  const distance = differenceInCalendarDays(givenDate, curDate);
  const sameYear = givenDate.getUTCFullYear() === curDate.getUTCFullYear();
  let pattern = '';

  if (distance === 0) {
    return 'Today';
  } else if (distance === 1) {
    return 'Tomorrow';
  } else if (distance === -1) {
    pattern = 'Yesterday';
  } else if (sameYear) {
    pattern = 'ddd, DD MMM';
  } else {
    pattern = DEFAULT_FORMAT;
  }
  return timestampToString(timestamp, pattern);
};
