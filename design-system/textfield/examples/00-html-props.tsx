import React from 'react';

import { Label } from '@atlaskit/form';

import Textfield from '../src';

export default function HtmlPropsExample() {
  return (
    <div>
      <Label htmlFor="password">Password text field</Label>
      <Textfield name="password" type="password" id="password" />
      <Label htmlFor="number">Number field (with min/max values)</Label>
      <Textfield name="number" type="number" id="number" max={5} min={0} />
    </div>
  );
}
