import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="DatePicker - isInvalid" />
      <TimePicker onChange={console.log} isInvalid />

      <Label label="TimePicker - isInvalid" />
      <DatePicker onChange={console.log} isInvalid />

      <Label label="DateTimePicker - isInvalid" />
      <DateTimePicker onChange={console.log} isInvalid />
    </div>
  );
};
