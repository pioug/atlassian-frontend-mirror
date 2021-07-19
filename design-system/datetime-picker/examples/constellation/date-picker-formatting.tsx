import React from 'react';

import parse from 'date-fns/parse';

import { DatePicker } from '../../src';

const DatePickerFormattingExample = () => (
  <DatePicker
    dateFormat="YYYY-MM-DD"
    placeholder="2021-06-10"
    parseInputValue={(date: string) => parse(date)}
  />
);

export default DatePickerFormattingExample;
