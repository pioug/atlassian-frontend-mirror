import React from 'react';

import Calendar from '../src';

export default () => {
  return (
    <Calendar
      defaultMonth={12}
      defaultYear={2020}
      defaultDay={15}
      minDate={'2020-12-10'}
      maxDate={'2020-12-20'}
    />
  );
};
