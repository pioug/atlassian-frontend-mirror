import React from 'react';

// eslint-disable-next-line no-restricted-imports
import format from 'date-fns/format';
import parse from 'date-fns/parse';

import { DatePicker } from '../src';

function now(day: number) {
  const date = new Date();
  date.setDate(day);
  return format(date, 'YYYY-MM-DD');
}

// Make sure your filter callback has a stable reference to avoid necessary re-renders,
// either by defining it outside of the render function's scope or using useCallback
const weekendFilter = (date: string) => {
  const dayOfWeek = parse(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

// Make sure your filter callback has a stable reference to avoid necessary re-renders,
// either by defining it outside of the render function's scope or using useState
const disabledDates = [now(10), now(11), now(12)];

export default () => {
  return (
    <DatePicker
      minDate={now(8)}
      maxDate={now(28)}
      disabled={disabledDates}
      disabledDateFilter={weekendFilter}
      onChange={console.log}
    />
  );
};
