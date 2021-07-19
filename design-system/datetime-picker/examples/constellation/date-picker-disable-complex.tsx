import React from 'react';

import parse from 'date-fns/parse';

import { DatePicker } from '../../src';

const weekendFilter = (date: string) => {
  const dayOfWeek = parse(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const DatePickerDisableComplexExample = () => (
  <DatePicker defaultValue="2020-12-15" disabledDateFilter={weekendFilter} />
);

export default DatePickerDisableComplexExample;
