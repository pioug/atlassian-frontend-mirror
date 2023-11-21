import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../src';

export default () => {
  return (
    <div>
      <h3>DatePicker</h3>
      <Label htmlFor="react-select-is-open--input">Always open</Label>
      <DatePicker id="react-select-is-open--input" isOpen />
    </div>
  );
};
