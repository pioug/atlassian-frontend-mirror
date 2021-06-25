import React, { Fragment } from 'react';

import { RadioGroup } from '../src';
import { OptionsPropType } from '../src/types';

const options: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red', testId: 'red' },
  { name: 'color', value: 'blue', label: 'Blue', testId: 'blue' },
  { name: 'color', value: 'yellow', label: 'Yellow', testId: 'yellow' },
  { name: 'color', value: 'green', label: 'Green', testId: 'green' },
  {
    name: 'color',
    value: 'black',
    label: 'Black',
    testId: 'black',
  },
];

export default function BasicExample() {
  return (
    <Fragment>
      <h4 id="radiogroup-testing-label">Choose a color:</h4>
      <RadioGroup
        options={options}
        aria-labelledby="radiogroup-testing-label"
      />
    </Fragment>
  );
}
