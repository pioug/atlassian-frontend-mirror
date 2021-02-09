import type { DateObj } from '../types';

import pad from './pad';

interface DateToStringOptions {
  fixMonth: boolean;
}

export default function dateToString(
  date: DateObj,
  options?: DateToStringOptions,
) {
  return `${date.year}-${pad(
    date.month + (options && options.fixMonth ? 1 : 0),
  )}-${pad(date.day)}`;
}
