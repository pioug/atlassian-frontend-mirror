import React from 'react';
import { Checkbox } from '../../src';

const DisabledCheckbox = () => {
  return (
    <Checkbox
      isDisabled
      label="Disabled"
      value="Disabled"
      name="checkbox-disabled"
      testId="cb-disabled"
    />
  );
};

export default DisabledCheckbox;
