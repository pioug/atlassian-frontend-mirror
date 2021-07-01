import React from 'react';

import { Radio } from '../../src';

export default function RadioDefaultExample() {
  return (
    <div>
      <Radio
        value="default radio"
        label="Default radio"
        name="radio-default"
        testId="radio-default"
        isChecked={true}
        onChange={() => {}}
      />
      <Radio
        value="disabled radio"
        label="Disabled radio"
        name="radio-disabled"
        testId="radio-disabled"
        isChecked={false}
        isDisabled={true}
        onChange={() => {}}
      />
    </div>
  );
}
