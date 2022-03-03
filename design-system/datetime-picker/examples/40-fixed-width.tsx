import React from 'react';

import { Label } from '@atlaskit/form';
import { gridSize } from '@atlaskit/theme/constants';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label htmlFor="react-select-date--input">Date picker</Label>
      <DatePicker
        id="date"
        innerProps={{ style: { width: gridSize() * 20 } }}
        onChange={console.log}
      />
      <Label htmlFor="react-select-time--input">Time picker</Label>
      <TimePicker
        id="time"
        innerProps={{ style: { width: gridSize() * 20 } }}
        onChange={console.log}
      />
      <Label htmlFor="react-select-date-time--input">Date / time picker</Label>
      <DateTimePicker
        id="date-time"
        innerProps={{ style: { width: gridSize() * 40 } }}
        onChange={console.log}
      />
    </div>
  );
};
