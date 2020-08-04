import React from 'react';

import { Checkbox } from '../../src';

export default () => (
  <Checkbox
    isDisabled
    label="Disabled checkbox"
    value="Disabled"
    name="checkbox-disabled"
    testId="cb-disabled"
  />
);
