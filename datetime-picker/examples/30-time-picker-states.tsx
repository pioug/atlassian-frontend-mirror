import React from 'react';
import { Label } from '@atlaskit/field-base';
import { TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Stock" />
      <TimePicker onChange={console.log} />

      <Label label="Disabled input" />
      <TimePicker isDisabled onChange={console.log} />
    </div>
  );
};
