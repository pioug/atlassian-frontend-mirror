import React from 'react';

import { DateTimePicker } from '../../src';

const disabledDates = [
  '2020-12-07',
  '2020-12-08',
  '2020-12-09',
  '2020-12-16',
  '2020-12-17',
  '2020-12-18',
];

const DateTimePickerDisabledExample = () => (
  <DateTimePicker
    defaultValue="2020-12-15"
    datePickerProps={{ disabled: disabledDates }}
  />
);

export default DateTimePickerDisabledExample;
