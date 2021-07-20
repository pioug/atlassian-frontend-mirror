import React from 'react';

// eslint-disable-next-line no-restricted-imports
import { parseISO } from 'date-fns';

import Calendar from '../src';

// Make sure your filter callback has a stable reference to avoid necessary re-renders,
// either by defining it outside of the render function's scope or using useCallback
const weekendFilter = (date: string) => {
  const dayOfWeek = parseISO(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export default () => {
  return (
    <Calendar
      defaultMonth={12}
      defaultYear={2020}
      defaultDay={15}
      disabledDateFilter={weekendFilter}
    />
  );
};
