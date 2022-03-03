import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label htmlFor="react-select-time--input">TimePicker - isInvalid</Label>
      <TimePicker id="time" onChange={console.log} isInvalid />

      <Label htmlFor="react-select-date--input">DatePicker - isInvalid</Label>
      <DatePicker id="date" onChange={console.log} isInvalid />

      <Label htmlFor="react-select-datetime--input">
        DateTimePicker - isInvalid
      </Label>
      <DateTimePicker id="datetime" onChange={console.log} isInvalid />
    </div>
  );
};
