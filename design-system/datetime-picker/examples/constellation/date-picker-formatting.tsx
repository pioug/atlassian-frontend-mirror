import React from 'react';

import { parseISO } from 'date-fns';

import { DatePicker } from '../../src';

const DatePickerFormattingExample = () => (
  <DatePicker
    dateFormat="YYYY-MM-DD"
    placeholder="2021-06-10"
    parseInputValue={(date: string) => parseISO(date)}
  />
);

export default DatePickerFormattingExample;
