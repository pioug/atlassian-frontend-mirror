import React from 'react';

import { DatePicker } from '../../src';

const disabledDates = [
  '2020-12-07',
  '2020-12-08',
  '2020-12-09',
  '2020-12-16',
  '2020-12-17',
  '2020-12-18',
];

const DatePickerDisabledExample = () => (
  <DatePicker defaultValue="2020-12-15" disabled={disabledDates} />
);

export default DatePickerDisabledExample;
