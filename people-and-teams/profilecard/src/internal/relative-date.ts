import differenceInMonths from 'date-fns/differenceInMonths';
import isThisMonth from 'date-fns/isThisMonth';
import isThisWeek from 'date-fns/isThisWeek';
import isValid from 'date-fns/isValid';

import { RelativeDateKeyType } from '../types';

export function isValidDate(date: Date, today: Date = new Date()) {
  return !!date.getTime && isValid(date) && date.getTime() <= today.getTime();
}

export default function getRelativeDateKey(
  date?: Date | null,
  today: Date = new Date(),
): RelativeDateKeyType {
  if (!date || !isValidDate(date, today)) {
    return null;
  }

  if (isThisWeek(date)) {
    return 'ThisWeek';
  }

  if (isThisMonth(date)) {
    return 'ThisMonth';
  }

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() - 1
  ) {
    return 'LastMonth';
  }

  const diffInMonths = differenceInMonths(today, date);
  if (diffInMonths < 6) {
    return 'AFewMonths';
  }

  if (diffInMonths <= 12) {
    return 'SeveralMonths';
  }

  return 'MoreThanAYear';
}
