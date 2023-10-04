import React from 'react';

import { Label } from '@atlaskit/form';

import Textfield from '../src';

export default function MaxValueExample() {
  return (
    <div>
      <Label htmlFor="max">Max length of 5</Label>
      <Textfield name="max" maxLength={5} id="max" />
    </div>
  );
}
