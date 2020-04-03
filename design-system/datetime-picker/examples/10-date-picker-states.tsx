// eslint-disable-next-line no-restricted-imports
import { format } from 'date-fns';
import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker } from '../src';

function now(day: number) {
  const date = new Date();
  date.setDate(day);
  return format(date, 'YYYY-MM-DD');
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
      <DatePicker
        disabled={[now(31), now(30), now(10), now(11), now(12)]}
        onChange={console.log}
      />

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
