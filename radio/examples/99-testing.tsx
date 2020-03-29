import React, { PureComponent } from 'react';

import { RadioGroup } from '../src';
import { OptionsPropType } from '../src/types';

const options: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red', testId: 'red' },
  { name: 'color', value: 'blue', label: 'Blue', testId: 'blue' },
  { name: 'color', value: 'yellow', label: 'Yellow', testId: 'yellow' },
  { name: 'color', value: 'green', label: 'Green', testId: 'green' },
  { name: 'color', value: 'black', label: 'Black', testId: 'black' },
];

export default class BasicExample extends PureComponent {
  render() {
    return (
      <div>
        <h4>Choose a color:</h4>
        <RadioGroup options={options} />
      </div>
    );
  }
}
