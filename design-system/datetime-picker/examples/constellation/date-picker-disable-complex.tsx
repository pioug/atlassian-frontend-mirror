import React from 'react';

// eslint-disable-next-line no-restricted-imports
import { parseISO } from 'date-fns';

import { DatePicker } from '../../src';

const weekendFilter = (date: string) => {
  const dayOfWeek = parseISO(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const DatePickerDisableComplexExample = () => (
  <DatePicker defaultValue="2020-12-15" disabledDateFilter={weekendFilter} />
);

export default DatePickerDisableComplexExample;
