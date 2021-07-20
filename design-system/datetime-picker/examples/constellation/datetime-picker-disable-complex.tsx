import React from 'react';

// eslint-disable-next-line no-restricted-imports
import { parseISO } from 'date-fns';

import { DateTimePicker } from '../../src';

const weekendFilter = (date: string) => {
  const dayOfWeek = parseISO(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const DateTimePickerDisableComplexExample = () => (
  <DateTimePicker
    defaultValue="2020-12-15"
    datePickerProps={{ disabledDateFilter: weekendFilter }}
  />
);

export default DateTimePickerDisableComplexExample;
