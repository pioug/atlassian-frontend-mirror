import React from 'react';

import { DateTimePicker } from '../../src';

const DateTimePickerDisableRangeExample = () => (
  <DateTimePicker
    defaultValue="2020-12-15"
    datePickerProps={{ minDate: '2020-12-10', maxDate: '2020-12-20' }}
  />
);

export default DateTimePickerDisableRangeExample;
