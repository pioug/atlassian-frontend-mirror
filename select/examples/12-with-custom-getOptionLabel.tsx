import React, { Component, Fragment } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxSelect, OptionType } from '../src';

const customGetOptionLabel = (option: OptionType) => {
  return option.label.length >= 10
    ? `${option.label.substring(0, 7)}...`
    : option.label;
};

interface State {
  useCustomOptionLabel: boolean;
  value?: string;
}

export default class WithCustomGetOptionLabel extends Component<{}, State> {
  state = {
    useCustomOptionLabel: true,
  };

  toggleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    this.setState(state => ({ ...state, value }));
  };

  render() {
    return (
      <Fragment>
        {this.state.useCustomOptionLabel ? (
          <CheckboxSelect
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
      </Fragment>
    );
  }
}
