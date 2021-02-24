import { daysPerWeek } from '../constants';
import type { Week, WeekDay } from '../types';

import dateToString from './date-to-string';
import getBaseCalendar from './get-base-calendar';

export default function getWeeks({
  day,
  month,
  year,
  today,
  disabled,
  selected,
  previouslySelected,
  weekStartDay,
}: {
  day: number;
  month: number;
  year: number;
  today: string;
  disabled: string[];
  selected: string[];
  previouslySelected: string[];
  weekStartDay: WeekDay;
}) {
  const calendarBaseOptions = { weekStartDay };
  const calendar = getBaseCalendar(year, month - 1, calendarBaseOptions);

  const weeks: Week[] = [];
  const shouldDisplaySixthWeek = calendar.length % 6;

  // Some months jump between 5 and 6 weeks to display. In some cases 4 (Feb
  // with the 1st on a Monday etc). This ensures the UI doesn't jump around by
  // catering to always showing 6 weeks.
  if (shouldDisplaySixthWeek) {
    const lastDayIsSibling = calendar[calendar.length - 1].siblingMonth;
    const sliceStart = lastDayIsSibling ? daysPerWeek : 0;

    calendar.push(
      ...getBaseCalendar(year, month, calendarBaseOptions)
        .slice(sliceStart, sliceStart + daysPerWeek)
        .map(date => ({ ...date, siblingMonth: true })),
    );
  }

  calendar.forEach(date => {
    const dateAsString = dateToString(date, { fixMonth: true });

    let week;

    if (date.weekDay === calendarBaseOptions.weekStartDay) {
      week = { id: dateAsString, values: [] };
      weeks.push(week);
    } else {
      week = weeks[weeks.length - 1];
    }

    const isDisabled = disabled.indexOf(dateAsString) > -1;
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
}
