import React from 'react';

import Calendar from '../src';

const disabled = ['2020-12-04'];
const defaultPreviouslySelected = ['2020-12-06'];
const defaultSelected = ['2020-12-08'];

export default () => (
  <Calendar
    disabled={disabled}
    defaultPreviouslySelected={defaultPreviouslySelected}
    defaultSelected={defaultSelected}
    defaultMonth={12}
    defaultYear={2020}
    testId="the-calendar"
  />
);
