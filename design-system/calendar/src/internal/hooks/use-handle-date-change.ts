import { useCallback } from 'react';

import { Calendar as CalendarBase } from 'calendar-base';

import type { ChangeEvent } from '../../types';
import { daysPerWeek, monthsPerYear } from '../constants';
import type { ArrowKeys } from '../types';
import dateToString from '../utils/date-to-string';

const getNextMonth = (monthValue: number, yearValue: number) => {
  let month = monthValue;
  let year = yearValue;

  if (month === monthsPerYear) {
    month = 1;
    year += 1;
  } else {
    month += 1;
  }

  return { month, year };
};

const getPrevMonth = (monthValue: number, yearValue: number) => {
  let month = monthValue;
  let year = yearValue;

  if (month === 1) {
    month = monthsPerYear;
    year -= 1;
  } else {
    month -= 1;
  }

  return { month, year };
};

export default function useHandleDateChange({
  day: [dayValue, setDayValue],
  month: [monthValue, setMonthValue],
  year: [yearValue, setYearValue],
  onChange,
}: {
  day: readonly [number, (newValue: number) => void];
  month: readonly [number, (newValue: number) => void];
  year: readonly [number, (newValue: number) => void];
  onChange: (event: ChangeEvent) => void;
}) {
  const triggerOnChange = useCallback(
    ({ year, month, day, type }: ChangeEvent) => {
      const iso = dateToString({ year, month, day });

      onChange({ day, month, year, iso, type });
      setDayValue(day);
      setMonthValue(month);
      setYearValue(year);
    },
    [onChange, setDayValue, setMonthValue, setYearValue],
  );

  const navigate = useCallback(
    (type: ArrowKeys) => {
      if (type === 'down') {
        const next = dayValue + daysPerWeek;
        const daysInMonth = CalendarBase.daysInMonth(yearValue, monthValue - 1);

        if (next > daysInMonth) {
          const { month: nextMonth, year: nextYear } = getNextMonth(
            monthValue,
            yearValue,
          );
          triggerOnChange({
            year: nextYear,
            month: nextMonth,
            day: next - daysInMonth,
            type,
          });
        } else {
          triggerOnChange({
            year: yearValue,
            month: monthValue,
            day: next,
            type,
          });
        }
      } else if (type === 'left') {
        const prev = dayValue - 1;

        if (prev < 1) {
          const { month: prevMonth, year: prevYear } = getPrevMonth(
            monthValue,
            yearValue,
          );
          const prevDay = CalendarBase.daysInMonth(prevYear, prevMonth - 1);
          triggerOnChange({
            year: prevYear,
            month: prevMonth,
            day: prevDay,
            type,
          });
        } else {
          triggerOnChange({
            year: yearValue,
            month: monthValue,
            day: prev,
            type,
          });
        }
      } else if (type === 'right') {
        const next = dayValue + 1;
        const daysInMonth = CalendarBase.daysInMonth(yearValue, monthValue - 1);

        if (next > daysInMonth) {
          const { month: nextMonth, year: nextYear } = getNextMonth(
            monthValue,
            yearValue,
          );
          triggerOnChange({
            year: nextYear,
            month: nextMonth,
            day: 1,
            type,
          });
        } else {
          triggerOnChange({
            year: yearValue,
            month: monthValue,
            day: next,
            type,
          });
        }
      } else if (type === 'up') {
        const prev = dayValue - daysPerWeek;

        if (prev < 1) {
          const { month: prevMonth, year: prevYear } = getPrevMonth(
            monthValue,
            yearValue,
          );
          const prevDay =
            CalendarBase.daysInMonth(prevYear, prevMonth - 1) + prev;
          triggerOnChange({
            year: prevYear,
            month: prevMonth,
            day: prevDay,
            type,
          });
        } else {
          triggerOnChange({
            year: yearValue,
            month: monthValue,
            day: prev,
            type,
          });
        }
      }
    },
    [triggerOnChange, dayValue, monthValue, yearValue],
  );

  const handleClickNext = useCallback(() => {
    const { day, month, year } = {
      ...{
        day: dayValue,
        month: monthValue,
        year: yearValue,
      },
      ...getNextMonth(monthValue, yearValue),
    };

    triggerOnChange({ day, month, year, type: 'next' });
  }, [triggerOnChange, dayValue, monthValue, yearValue]);

  const handleClickPrev = useCallback(() => {
    const { day, month, year } = {
      ...{
        day: dayValue,
        month: monthValue,
        year: yearValue,
      },
      ...getPrevMonth(monthValue, yearValue),
    };

    triggerOnChange({ day, month, year, type: 'prev' });
  }, [triggerOnChange, dayValue, monthValue, yearValue]);

  return {
    navigate,
    handleClickNext,
    handleClickPrev,
  };
}
