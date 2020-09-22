import React from 'react';

import { Checkbox } from '../src';

export default () => (
  <Checkbox
    value="default checkbox"
    label="Default checkbox"
    onChange={() => {}}
    name="checkbox-default"
    testId="cb-default"
  />
);
