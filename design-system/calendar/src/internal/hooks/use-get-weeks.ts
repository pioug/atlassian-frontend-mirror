import { useMemo } from 'react';

// eslint-disable-next-line no-restricted-imports
import { parseISO } from 'date-fns';

import type { WeekDay } from '../../types';
import { daysPerWeek } from '../constants';
import type { CalendarDate, Week } from '../types';
import dateToString from '../utils/date-to-string';
import getBaseCalendar from '../utils/get-base-calendar';

function useGetCalendarWithSixthWeek(
  calendar: CalendarDate[],
  {
    month,
    year,
    weekStartDay,
  }: {
    month: number;
    year: number;
    weekStartDay: WeekDay;
  },
) {
  const shouldDisplaySixthWeek = calendar.length % 6;
  const calendarLastValue = calendar[calendar.length - 1];

  return useMemo(() => {
    // Some months jump between 5 and 6 weeks to display. In some cases 4 (Feb
    // with the 1st on a Monday etc). This ensures the UI doesn't jump around by
    // catering to always showing 6 weeks.
    if (shouldDisplaySixthWeek) {
      const lastDayIsSibling = calendarLastValue.siblingMonth;
      const sliceStart = lastDayIsSibling ? daysPerWeek : 0;

      return getBaseCalendar(year, month, { weekStartDay })
        .slice(sliceStart, sliceStart + daysPerWeek)
        .map((date) => ({ ...date, siblingMonth: true }));
    }
  }, [calendarLastValue, month, shouldDisplaySixthWeek, weekStartDay, year]);
}

export default function useGetWeeks({
  day,
  month,
  year,
  today,
  disabled,
  disabledDateFilter,
  minDate: minDateString,
  maxDate: maxDateString,
  selected,
  previouslySelected,
  weekStartDay,
}: {
  day: number;
  month: number;
  year: number;
  today: string;
  disabled?: string[];
  disabledDateFilter?: (date: string) => boolean;
  minDate?: string;
  maxDate?: string;
  selected: string[];
  previouslySelected: string[];
  weekStartDay: WeekDay;
}) {
  const calendar = useMemo(
    () => getBaseCalendar(year, month - 1, { weekStartDay }),
    [month, weekStartDay, year],
  );

  const calendarWithSixthWeek = useGetCalendarWithSixthWeek(calendar, {
    month,
    year,
    weekStartDay,
  });

  if (calendarWithSixthWeek) {
    calendar.push(...calendarWithSixthWeek);
  }

  const minDate = minDateString ? parseISO(minDateString) : undefined;
  const maxDate = maxDateString ? parseISO(maxDateString) : undefined;
  const needJsDate = minDateString || maxDateString;

  return useMemo(() => {
    const weeks: Week[] = [];

    calendar.forEach((date) => {
      const dateAsString = dateToString(date, { fixMonth: true });
      const JSDate = needJsDate ? parseISO(dateAsString) : undefined;

      let week;
      if (date.weekDay === weekStartDay) {
        week = { id: dateAsString, values: [] };
        weeks.push(week);
      } else {
        week = weeks[weeks.length - 1];
      }

      // Define a bunch of `const`s
      const isDisabledByArray = disabled
        ? disabled.indexOf(dateAsString) > -1
        : false;
      const isDisabledByFilter = disabledDateFilter
        ? disabledDateFilter(dateAsString)
        : false;
      const isDisabledByMin = minDate && JSDate ? JSDate < minDate : false;
      const isDisabledByMax = maxDate && JSDate ? JSDate > maxDate : false;
      const isDisabled =
        isDisabledByArray ||
        isDisabledByFilter ||
        isDisabledByMin ||
        isDisabledByMax;

      const isFocused = day === date.day && !date.siblingMonth;
      const isPreviouslySelected =
        !isDisabled && previouslySelected.indexOf(dateAsString) > -1;
      const isSelected = !isDisabled && selected.indexOf(dateAsString) > -1;
      const isSiblingMonth = !!date.siblingMonth;
      const isToday = today === dateAsString;

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
  }, [
    calendar,
    day,
    disabled,
    disabledDateFilter,
    minDate,
    maxDate,
    needJsDate,
    previouslySelected,
    selected,
    today,
    weekStartDay,
  ]);
}
