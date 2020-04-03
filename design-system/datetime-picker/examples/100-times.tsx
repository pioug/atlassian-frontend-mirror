import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DateTimePicker, TimePicker } from '../src';

export default () => {
  const times: Array<string> = ['10:00', '10:15', '10:30', '10:45', '11:00'];

  return (
    <div>
      <Label label="TimePicker - times" />
      <TimePicker
        id="timepicker"
        times={times}
        selectProps={{ classNamePrefix: 'timepicker-select' }}
        testId={'timePicker'}
      />

      <Label label="DateTimePicker - times" />
      <DateTimePicker times={times} />
    </div>
  );
};
