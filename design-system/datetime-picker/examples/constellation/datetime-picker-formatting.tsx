import React from 'react';

// eslint-disable-next-line no-restricted-imports
import { parseISO } from 'date-fns';

import { DateTimePicker } from '../../src';

const DateTimePickerFormattingExample = () => (
  <DateTimePicker
    dateFormat="YYYY-MM-DD"
    timeFormat="HH:mm"
    datePickerProps={{
      placeholder: '2021-06-10',
      parseInputValue: (date: string) => parseISO(date),
    }}
    timePickerProps={{
      placeholder: '13:30',
    }}
  />
);

export default DateTimePickerFormattingExample;
