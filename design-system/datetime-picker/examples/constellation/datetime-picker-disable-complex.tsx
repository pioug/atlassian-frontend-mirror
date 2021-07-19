import React from 'react';

import parse from 'date-fns/parse';

import { DateTimePicker } from '../../src';

const weekendFilter = (date: string) => {
  const dayOfWeek = parse(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const DateTimePickerDisableComplexExample = () => (
  <DateTimePicker
    defaultValue="2020-12-15"
    datePickerProps={{ disabledDateFilter: weekendFilter }}
  />
);

export default DateTimePickerDisableComplexExample;
