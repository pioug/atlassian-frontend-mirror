import React from 'react';

import { Checkbox } from '../../src';

export default () => (
  <Checkbox
    isInvalid
    label="Invalid checkbox"
    value="Invalid"
    name="checkbox-invalid"
    testId="cb-invalid"
  />
);
