import React from 'react';

import { Label } from '@atlaskit/form';

import { DateTimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label htmlFor="react-select-stock--input">Stock</Label>
      <DateTimePicker id="stock" onChange={console.log} />

      <Label htmlFor="react-select-stock-value--input">Stock with value</Label>
      <DateTimePicker
        id="stock-value"
        onChange={console.log}
        defaultValue="2020-10-10"
      />

      <Label htmlFor="react-select-disabled--input">Disabled input</Label>
      <DateTimePicker id="disabled" isDisabled onChange={console.log} />

      <Label htmlFor="react-select-disabled-value--input">
        Disabled input with value
      </Label>
      <DateTimePicker
        id="disabled-value"
        isDisabled
        onChange={console.log}
        defaultValue="2020-10-10"
      />

      <Label htmlFor="react-select-custom--input">Custom date format</Label>
      <DateTimePicker
        id="custom"
        onChange={console.log}
        dateFormat="DD/MMM/YY"
        datePickerSelectProps={{
          placeholder: 'e.g. 31/Dec/18',
        }}
      />

      <Label htmlFor="react-select-custom-value--input">
        Custom date format with value
      </Label>
      <DateTimePicker
        id="custom-value"
        onChange={console.log}
        dateFormat="DD/MMM/YY"
        datePickerSelectProps={{
          placeholder: 'e.g. 31/Dec/18',
        }}
        defaultValue="2020-10-10"
      />
    </div>
  );
};
