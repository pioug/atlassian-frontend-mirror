import React, { Component } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { Label } from '@atlaskit/form';

import { CheckboxSelect, type OptionType } from '../src';

const customGetOptionLabel = (option: OptionType) => {
  return option.label.length >= 10
    ? `${option.label.substring(0, 7)}...`
    : option.label;
};

interface State {
  useCustomOptionLabel: boolean;
  value?: string;
}

class WithCustomGetOptionLabel extends Component<{}, State> {
  state = {
    useCustomOptionLabel: true,
  };

  toggleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    this.setState((state) => ({ ...state, value }));
  };

  render() {
    return (
      <>
        <Label htmlFor="custom-opt-label-example">
          Which city do you live in?
        </Label>
        {this.state.useCustomOptionLabel ? (
          <CheckboxSelect
            inputId="custom-opt-label-example"
            options={[
              {
                label:
                  'THIS IS A REALLY LONG LABEL FOR A REALLY NOT SO LONG VALUE',
                value: 'one',
              },
            ]}
            placeholder="Choose a City"
            getOptionLabel={customGetOptionLabel}
          />
        ) : (
          <CheckboxSelect
            inputId="custom-opt-label-example"
            options={[
              {
                label:
                  'THIS IS A REALLY LONG LABEL FOR A REALLY NOT SO LONG VALUE',
                value: 'one',
              },
            ]}
            placeholder="Choose a City"
          />
        )}

        <Checkbox
          value="useCustomOptionLabel"
          label="Define custom getOptionLabel"
          name="defineCustomGetOptionLabel"
          onChange={this.toggleValue}
        />
      </>
    );
  }
}

export default () => <WithCustomGetOptionLabel />;
