import React, { SyntheticEvent } from 'react';

import { RadioGroup } from '../src';

const radioValues = [
  { name: 'color-with-default', value: 'blue', label: 'Blue' },
  { name: 'color-with-default', value: 'red', label: 'Red' },
  { name: 'color-with-default', value: 'purple', label: 'Purple' },
];

export default function ControlledRadioGroup() {
  return (
    <RadioGroup
      onChange={(event: SyntheticEvent<any>) => {
        console.log('onChange called with value: ', event.currentTarget.value);
      }}
      defaultValue={radioValues[2].value}
      options={radioValues}
    />
  );
}
