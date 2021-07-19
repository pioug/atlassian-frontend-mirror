import React from 'react';

import parse from 'date-fns/parse';

import { DateTimePicker } from '../../src';

const DateTimePickerFormattingExample = () => (
  <DateTimePicker
    dateFormat="YYYY-MM-DD"
    timeFormat="HH:mm"
    datePickerProps={{
      placeholder: '2021-06-10',
      parseInputValue: (date: string) => parse(date),
    }}
    timePickerProps={{
      placeholder: '13:30',
    }}
  />
);

export default DateTimePickerFormattingExample;
