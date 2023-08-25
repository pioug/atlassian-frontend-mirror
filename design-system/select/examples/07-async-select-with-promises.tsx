import React, { Component } from 'react';

import { Label } from '@atlaskit/form';

import { cities } from './common/data';
import { AsyncSelect, OptionsType } from '../src';

interface State {
  inputValue: string;
}

const filterCities = (inputValue: string) =>
  cities.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

const promiseOptions = (inputValue: string) =>
  new Promise<OptionsType>((resolve) => {
    setTimeout(() => {
      resolve(filterCities(inputValue));
    }, 1000);
  });

export default class WithPromises extends Component<{}, State> {
  state = { inputValue: '' };

  handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };

  render() {
    return (
      <>
        <Label htmlFor="async-example">Which country do you live in?</Label>
        <AsyncSelect
          inputId="async-example"
          cacheOptions
          defaultOptions
          loadOptions={promiseOptions}
        />
      </>
    );
  }
}
