import React from 'react';

import parse from 'date-fns/parse';

import Calendar from '../src';

// Make sure your filter callback has a stable reference to avoid necessary re-renders,
// either by defining it outside of the render function's scope or using useCallback
const weekendFilter = (date: string) => {
  const dayOfWeek = parse(date).getDay();
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
