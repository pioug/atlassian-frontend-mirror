import React from 'react';

import { Label } from '@atlaskit/field-base';

import { TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Stock" />
      <TimePicker
        onChange={console.log}
        id="timepicker-1"
        testId="timepicker-1"
        selectProps={{ classNamePrefix: 'timepicker-select' }}
      />

      <Label label="Disabled input" />
      <TimePicker isDisabled onChange={console.log} />
    </div>
  );
};
