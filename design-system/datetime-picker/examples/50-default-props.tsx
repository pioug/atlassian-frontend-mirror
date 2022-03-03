import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label htmlFor="react-select-date--input">
        DatePicker defaultValue defaultIsOpen
      </Label>
      <DatePicker
        id="date"
        defaultValue="2018-03-01"
        defaultIsOpen
        onChange={console.log}
      />

      <Label htmlFor="react-select-time--input">
        TimePicker defaultValue defaultIsOpen
      </Label>
      <TimePicker
        id="time"
        defaultValue="10:00am"
        defaultIsOpen
        onChange={console.log}
      />

      <Label htmlFor="react-select-date-time--input">
        DateTimePicker defaultValue
      </Label>
      <DateTimePicker
        id="date-time"
        defaultValue="2018-01-02T14:30-08:00"
        onChange={console.log}
      />
    </div>
  );
};
