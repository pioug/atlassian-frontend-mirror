import React, { PureComponent, SyntheticEvent } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import { RadioGroup } from '../src';
import { OptionsPropType } from '../src/types';

const options: OptionsPropType = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
  { name: 'color', value: 'black', label: 'Black' },
];

interface State {
  currentValue: string | null;
  isDisabled?: boolean;
  onChangeResult: string;
}

export default class BasicExample extends PureComponent<{}, State> {
  state = {
    currentValue: null,
    isDisabled: undefined,
    onChangeResult: 'Click on a radio field to trigger onChange',
  };

  onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      onChangeResult: `onChange called with value: ${event.currentTarget.value}`,
    });
  };

  toggleCheckbox = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      isDisabled: event.currentTarget.checked,
    });
  };

  render() {
    return (
      <div>
        <h4>Choose a color:</h4>
        <RadioGroup
          isDisabled={this.state.isDisabled}
          options={options}
          onChange={this.onChange}
        />
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          {this.state.onChangeResult}
        </div>
        <Checkbox
          value="isDisabled"
          label="is disabled"
          onChange={this.toggleCheckbox}
        />
      </div>
    );
  }
}
