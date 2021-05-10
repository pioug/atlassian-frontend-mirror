/**
 * Logic taken from https://github.com/WesSouza/calendar-base which is not maintained for quite sometime.
 * This will help us fixing any issue we might get or any new functionality we might want to support.
 * Not changing much code below. Just removed those parts which we don't need.
 */

import type { WeekDay } from '../../types';
import { daysPerWeek, monthsPerYear } from '../constants';
import type { CalendarDate } from '../types';

import getDaysInMonth from './get-days-in-month';

export default function getBaseCalendar(
  year: number,
  month: number,
  {
    weekStartDay = 0,
  }: {
    weekStartDay?: WeekDay;
  } = {
    weekStartDay: 0,
  },
) {
  const date = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth();

  const calendar: (CalendarDate | null)[] = [];

  const firstDay = date.getUTCDay();
  const firstDate = -((daysPerWeek - weekStartDay + firstDay) % daysPerWeek);

  const lastDate = getDaysInMonth(utcYear, utcMonth);
  const lastDay = (lastDate - firstDate) % daysPerWeek;

  const lastDateOfPreviousMonth = getDaysInMonth(utcYear, utcMonth - 1);

  let dateCounter = firstDate;
  let currentDay: WeekDay;
  let currentDate: number;
  let currentDateObject: CalendarDate | null = null;
  let calculatedMonth: number | undefined;
  let calculatedYear: number | undefined;

  const maxDateCount =
    lastDate -
    dateCounter +
    (lastDay !== 0 ? daysPerWeek - lastDay : 0) +
    firstDate;

  while (dateCounter < maxDateCount) {
    currentDate = dateCounter + 1;
    currentDay = (((dateCounter < 1 ? daysPerWeek + dateCounter : dateCounter) +
      firstDay) %
      daysPerWeek) as WeekDay;

    if (currentDate < 1 || currentDate > lastDate) {
      if (currentDate < 1) {
        calculatedMonth = utcMonth - 1;
        calculatedYear = utcYear;

        if (calculatedMonth < 0) {
          calculatedMonth = monthsPerYear - 1;
          calculatedYear--;
        }

        currentDate = lastDateOfPreviousMonth + currentDate;
      } else if (currentDate > lastDate) {
        calculatedMonth = utcMonth + 1;
        calculatedYear = utcYear;

        if (calculatedMonth > monthsPerYear - 1) {
          calculatedMonth = 0;
          calculatedYear++;
        }

        currentDate = dateCounter - lastDate + 1;
      }

      if (calculatedMonth !== undefined && calculatedYear !== undefined) {
        currentDateObject = {
          day: currentDate,
          weekDay: currentDay,
          month: calculatedMonth,
          year: calculatedYear,
          siblingMonth: true,
        };
      }
    } else {
      currentDateObject = {
        day: currentDate,
        weekDay: currentDay,
        month: utcMonth,
        year: utcYear,
      };
    }

    calendar.push(currentDateObject);

    dateCounter++;
  }

  return calendar as CalendarDate[];
}
