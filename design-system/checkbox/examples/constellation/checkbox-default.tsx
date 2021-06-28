import React from 'react';

import { Checkbox } from '../../src';

const CheckboxDefaultExample = () => {
  return (
    <Checkbox
      value="default checkbox"
      label="Default checkbox"
      onChange={() => {}}
      name="checkbox-default"
      testId="cb-default"
    />
  );
};

export default CheckboxDefaultExample;
