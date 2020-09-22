import React from 'react';

import { Radio } from '../src';

export default () => (
  <Radio
    value="default radio"
    label="Default radio"
    name="radio-default"
    testId="radio-default"
    isChecked={true}
    onChange={() => {}}
  />
);
