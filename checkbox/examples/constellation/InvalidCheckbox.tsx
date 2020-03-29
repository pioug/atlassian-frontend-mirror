import React from 'react';
import { Checkbox } from '../../src';

const InvalidCheckbox = () => {
  return (
    <Checkbox
      isInvalid
      label="Invalid"
      value="Invalid"
      name="checkbox-invalid"
      testId="cb-invalid"
    />
  );
};

export default InvalidCheckbox;
