import React from 'react';

import { Label } from '@atlaskit/form';

import { TimePicker } from '../../src';

const TimePickerDefaultExample = () => (
  <>
    <Label htmlFor="default-time-picker-example">Choose time</Label>
    <TimePicker
      selectProps={{
        inputId: 'default-time-picker-example',
      }}
    />
  </>
);

export default TimePickerDefaultExample;
