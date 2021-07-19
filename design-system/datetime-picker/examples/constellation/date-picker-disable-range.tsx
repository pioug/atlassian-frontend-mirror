import React from 'react';

import { DatePicker } from '../../src';

const DatePickerDisableRangeExample = () => (
  <DatePicker
    defaultValue="2020-12-15"
    minDate="2020-12-10"
    maxDate="2020-12-20"
  />
);

export default DatePickerDisableRangeExample;
