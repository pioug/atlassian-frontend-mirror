import React from 'react';

import { Checkbox } from '../src';

export default function BasicUsageExample() {
  return (
    <div>
      <Checkbox
        value="Small checkbox"
        label="Small checkbox"
        name="checkbox-basic"
        size="small"
        testId="small"
      />
      <Checkbox
        value="Medium checkbox"
        label="Medium checkbox"
        name="checkbox-basic"
        size="medium"
        testId="medium"
      />
      <Checkbox
        defaultChecked
        value="Large checkbox"
        label="Large checkbox"
        name="checkbox-basic"
        size="large"
        testId="large"
      />
      <Checkbox
        value="Extra large checkbox"
        label="Extra large checkbox"
        name="checkbox-basic"
        size="xlarge"
        testId="xlarge"
      />
    </div>
  );
}
