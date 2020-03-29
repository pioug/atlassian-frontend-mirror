import React, { Component, SyntheticEvent } from 'react';
import { RadioGroup } from '../src';

const radioValues = [
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'purple', label: 'Purple' },
];

type State = {
  value: string;
};

export default class ControlledRadioGroup extends Component<any, State> {
  onChange = (event: SyntheticEvent<any>) => {
    console.log('onChange called with value: ', event.currentTarget.value);
  };

  render() {
    return (
      <RadioGroup
        label="Pick a color"
        onChange={this.onChange}
        defaultValue={radioValues[2].value}
        options={radioValues}
      />
    );
  }
}
