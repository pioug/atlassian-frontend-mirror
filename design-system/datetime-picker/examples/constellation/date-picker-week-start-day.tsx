import React from 'react';

import { DatePicker } from '../../src';

const DatePickerWeekStartDayExample = () => (
  <>
    <DatePicker weekStartDay={0} />
    <br />
    <DatePicker weekStartDay={1} />
  </>
);

export default DatePickerWeekStartDayExample;
