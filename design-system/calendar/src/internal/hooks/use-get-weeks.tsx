import { Calendar as CalendarBase } from 'calendar-base';

import { daysPerWeek } from '../constants';
import type { Date, Week, WeekDay } from '../types';
import dateToString from '../utils/date-to-string';

import useLazyRef from './use-lazy-ref';

export default function useGetWeeks({
  day: [dayValue],
  month: [monthValue],
  year: [yearValue],
  today: [todayValue],
  disabled: [disabledValue],
  selected: [selectedValue],
  previous: [previouslySelectedValue],
  weekStartDay,
}: {
  day: readonly [number];
  month: readonly [number];
  year: readonly [number];
  today: readonly [string];
  disabled: [string[]];
  selected: [string[]];
  previous: [string[]];
  weekStartDay: WeekDay;
}) {
  const calendarBase = useLazyRef(
    () =>
      new CalendarBase({
        siblingMonths: true,
        weekNumbers: true,
      }),
  );

  calendarBase.weekStart = weekStartDay;

  const calendar = calendarBase.getCalendar(yearValue, monthValue - 1);
  const weeks: Week[] = [];
  const shouldDisplaySixthWeek = calendar.length % 6;

  // Some months jump between 5 and 6 weeks to display. In some cases 4 (Feb
  // with the 1st on a Monday etc). This ensures the UI doesn't jump around by
  // catering to always showing 6 weeks.
  if (shouldDisplaySixthWeek) {
    const lastDayIsSibling = calendar[calendar.length - 1].siblingMonth;
    const sliceStart = lastDayIsSibling ? daysPerWeek : 0;

    calendar.push(
      ...calendarBase
        .getCalendar(yearValue, monthValue)
        .slice(sliceStart, sliceStart + daysPerWeek)
        .map((date: Date) => ({ ...date, siblingMonth: true })),
    );
  }

  calendar.forEach((date: Date) => {
    const dateAsString = dateToString(date, { fixMonth: true });

    let week;

    if (date.weekDay === weekStartDay) {
      week = { id: dateAsString, values: [] };
      weeks.push(week);
    } else {
      week = weeks[weeks.length - 1];
    }

    const isDisabled = disabledValue.indexOf(dateAsString) > -1;
    const isFocused = dayValue === date.day && !date.siblingMonth;
    const isPreviouslySelected =
      !isDisabled && previouslySelectedValue.indexOf(dateAsString) > -1;
    const isSelected = !isDisabled && selectedValue.indexOf(dateAsString) > -1;
    const isSiblingMonth = date.siblingMonth;
    const isToday = todayValue === dateAsString;

    week.values.push({
      id: dateAsString,
      isDisabled,
      isFocused,
      isToday,
      month: date.month + 1,
      isPreviouslySelected,
      isSelected,
      isSiblingMonth,
      year: date.year,
      day: date.day,
    });
  });

  return weeks;
}
