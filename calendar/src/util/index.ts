import { DateObj } from '../types';

interface DateToStringOptions {
  fixMonth: boolean;
}

function pad(num: number) {
  return num < 10 ? `0${num}` : num;
}

export function dateToString(date: DateObj, options?: DateToStringOptions) {
  return `${date.year}-${pad(
    date.month + (options && options.fixMonth ? 1 : 0),
  )}-${pad(date.day)}`;
}
