import React from 'react';

import { Label } from '@atlaskit/form';

import Range from '../src';

export default () => (
  <>
    <Label htmlFor="range-disabled">Disabled</Label>
    <Range id="range-disabled" isDisabled />
  </>
);
