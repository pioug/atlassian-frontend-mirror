import React from 'react';

import { DateTimePicker } from '../../src';

const DateTimePickerWeekStartDayExample = () => (
  <>
    <DateTimePicker datePickerProps={{ weekStartDay: 0 }} />
    <br />
    <DateTimePicker datePickerProps={{ weekStartDay: 1 }} />
  </>
);

export default DateTimePickerWeekStartDayExample;
