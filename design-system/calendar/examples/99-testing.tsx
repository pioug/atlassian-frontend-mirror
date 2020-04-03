import React from 'react';

import Calendar from '../src';

export default () => (
  <Calendar
    defaultDisabled={['2020-12-04']}
    defaultPreviouslySelected={['2020-12-06']}
    defaultSelected={['2020-12-08']}
    defaultMonth={12}
    defaultYear={2020}
    testId="the-calendar"
  />
);
