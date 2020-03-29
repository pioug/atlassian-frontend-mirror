import React, { Component } from 'react';
import { cities } from './common/data';
import { AsyncSelect } from '../src';

interface State {
  inputValue: string;
}

const filterCities = (inputValue: string) =>
  cities.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));

const promiseOptions = (inputValue: string) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(filterCities(inputValue));
    }, 1000);
  });

export default class WithPromises extends Component<{}, State> {
  state = { inputValue: '' };

  handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    // eslint-disable-next-line react/no-unused-state
    this.setState({ inputValue });
    return inputValue;
  };

  render() {
    return (
      <AsyncSelect cacheOptions defaultOptions loadOptions={promiseOptions} />
    );
  }
}
