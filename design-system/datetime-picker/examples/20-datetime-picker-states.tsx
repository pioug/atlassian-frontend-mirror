import React from 'react';

import { Label } from '@atlaskit/field-base';

import { DateTimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Stock" />
      <DateTimePicker onChange={console.log} />

      <Label label="Stock with value" />
      <DateTimePicker onChange={console.log} defaultValue="2020-10-10" />

      <Label label="Disabled input" />
      <DateTimePicker isDisabled onChange={console.log} />

      <Label label="Disabled input with value" />
      <DateTimePicker
        isDisabled
        onChange={console.log}
        defaultValue="2020-10-10"
      />

      <Label label="Custom date format" />
      <DateTimePicker
        onChange={console.log}
        dateFormat="DD/MMM/YY"
        datePickerSelectProps={{
          placeholder: 'e.g. 31/Dec/18',
        }}
      />

      <Label label="Custom date format with value" />
      <DateTimePicker
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
