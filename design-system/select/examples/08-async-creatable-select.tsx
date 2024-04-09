import React, { Component } from 'react';

import { Label } from '@atlaskit/form';
import { Checkbox } from '@atlaskit/checkbox';

import { AsyncCreatableSelect as AsyncCreatable, OptionsType } from '../src';
import { cities } from './common/data';

interface State {
  allowCreateWhileLoading: boolean;
  options: OptionsType;
}

const createOption = (inputValue: string) => ({
  label: inputValue,
  value: inputValue.toLowerCase().replace(/\W/g, ''),
});

class AsyncCreatableExample extends Component<{}, State> {
  state = {
    allowCreateWhileLoading: false,
    options: cities,
  };

  loadTimeoutId?: number = undefined;

  componentWillUnmount() {
    clearTimeout(this.loadTimeoutId);
  }

  handleCreateOption = (inputValue: string) => {
    console.log('handleCreateOption here');
    this.setState({
      options: [createOption(inputValue), ...this.state.options],
    });
  };

  // you control how the options are filtered
  filterOptions = (inputValue: string) => {
    return this.state.options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  // async load function using callback (promises also supported)
  loadOptions = (
    inputValue: string,
    callback: (options: OptionsType) => void,
  ) => {
    this.loadTimeoutId = window.setTimeout(() => {
      callback(this.filterOptions(inputValue));
    }, 1000);
  };

  toggleValue = ({ value }: Record<string, any>) => {
    this.setState((state) => ({ ...state, value }));
  };

  render() {
    const { allowCreateWhileLoading } = this.state;
    return (
      <>
        <Label htmlFor="async-creatable-example">
          Which city do you live in?
        </Label>
        <AsyncCreatable
          inputId="async-creatable-example"
          loadOptions={this.loadOptions}
          allowCreateWhileLoading={allowCreateWhileLoading}
          onCreateOption={this.handleCreateOption}
          placeholder="Choose a City"
        />
        <Checkbox
          value="allowCreateWhileLoading"
          label="Allow create while loading"
          name="allowCreateWhileLoading"
          onChange={this.toggleValue}
        />
      </>
    );
  }
}

export default () => <AsyncCreatableExample />;
