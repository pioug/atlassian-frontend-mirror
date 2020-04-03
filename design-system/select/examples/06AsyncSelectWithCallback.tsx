import React from 'react';
import { AsyncSelect } from '../src';
import { OptionsType } from '../src/types';

import { cities } from './common/data';

// you control how the options are filtered
const filter = (inputValue: string) =>
  cities.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));

// async load function using callback (promises also supported)
const loadOptions = (
  inputValue: string,
  callback: (options: OptionsType) => void,
) => {
  setTimeout(() => {
    callback(filter(inputValue));
  }, 1000);
};

const AsyncExample = () => (
  <AsyncSelect
    className="async-select-with-callback"
    classNamePrefix="react-select"
    defaultOptions
    loadOptions={loadOptions}
    options={cities}
    placeholder="Choose a City"
  />
);

export default AsyncExample;
