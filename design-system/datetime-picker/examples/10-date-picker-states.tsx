import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../src';

function now(day: number) {
  const date = new Date();
  date.setDate(day);
  return date.toISOString();
}

export default () => {
  return (
    <div>
      <Label htmlFor="react-select-stock--input">Stock</Label>
      <DatePicker id="stock" onChange={console.log} testId={'datePicker'} />

      <Label htmlFor="react-select-disabled--input">Disabled input</Label>
      <DatePicker id="disabled" isDisabled onChange={console.log} />

      <Label htmlFor="react-select-disabled-dates--input">Disabled dates</Label>
      <DatePicker
        id="disabled-dates"
        minDate={now(8)}
        maxDate={now(28)}
        onChange={console.log}
      />

      <Label htmlFor="react-select-custom--input">Custom date format</Label>
      <DatePicker
        id="custom"
        dateFormat="DD/MMM/YY"
        selectProps={{
          placeholder: 'e.g. 31/Dec/18',
        }}
        onChange={console.log}
      />
    </div>
  );
};
