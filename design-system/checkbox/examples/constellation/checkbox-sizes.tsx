import React from 'react';

import { Checkbox } from '../../src';

export default function BasicUsageExample() {
  return (
    <div>
      <Checkbox
        value="Small checkbox"
        label="Small checkbox"
        name="checkbox-basic"
        size="small"
      />
      <Checkbox
        value="Medium checkbox"
        label="Medium checkbox"
        name="checkbox-basic"
        size="medium"
      />
      <Checkbox
        value="Large checkbox"
        label="Large checkbox"
        name="checkbox-basic"
        size="large"
        defaultChecked
      />
      <Checkbox
        value="Extra large checkbox"
        label="Extra large checkbox"
        name="checkbox-basic"
        size="xlarge"
      />
    </div>
  );
}
