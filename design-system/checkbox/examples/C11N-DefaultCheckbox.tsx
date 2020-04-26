import React from 'react';

import { Checkbox } from '../src';

const DefaultCheckbox = () => {
  return (
    <Checkbox
      value="default checkbox"
      label="default checkbox"
      onChange={() => {}}
      name="checkbox-default"
      testId="cb-default"
    />
  );
};

export default DefaultCheckbox;
