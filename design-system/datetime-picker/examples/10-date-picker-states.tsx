import React from 'react';

// import { format, parseISO } from 'date-fns';

import { Label } from '@atlaskit/field-base';

import { DatePicker } from '../src';

function now(day: number) {
  const date = new Date();
  date.setDate(day);
  return date.toISOString();
}

export default () => {
  return (
    <div>
      <Label label="Stock" />
      <DatePicker
        id="datepicker"
        onChange={console.log}
        testId={'datePicker'}
      />

      <Label label="Disabled input" />
      <DatePicker isDisabled onChange={console.log} />

      <Label label="Disabled dates" />
      <DatePicker minDate={now(8)} maxDate={now(28)} onChange={console.log} />

      <Label label="Custom date format" />
      <DatePicker
        dateFormat="DD/MMM/YY"
        selectProps={{
          placeholder: 'e.g. 31/Dec/18',
        }}
        onChange={console.log}
      />
    </div>
  );
};
