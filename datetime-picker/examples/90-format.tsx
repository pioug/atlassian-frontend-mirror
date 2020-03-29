import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      Dates & Times can be formatted using any format suported by{' '}
      <a
        href="https://date-fns.org/v1.29.0/docs/format"
        target="_blank"
        rel="noopener noreferrer"
      >
        date-fns format function
      </a>
      .
      <Label label="TimePicker - timeFormat (h:mm a)" />
      <TimePicker onChange={console.log} timeFormat="h:mm a" />
      <Label label="DatePicker - dateFormat (DD/MM/YYYY)" />
      <DatePicker onChange={console.log} dateFormat="DD/MM/YYYY" />
      <Label label="DateTimePicker - dateFormat (HH:mm) & timeFormat (Do MMMM YYYY)" />
      <DateTimePicker
        onChange={console.log}
        timeFormat="HH:mm"
        dateFormat="Do MMMM YYYY"
      />
    </div>
  );
};
