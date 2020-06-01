import React from 'react';
import Select from '../../src';
import { cities } from '../common/data';

export default () => (
  <Select
    className="multi-select"
    classNamePrefix="react-select"
    options={cities}
    isMulti
    isSearchable={false}
    placeholder="Choose a city"
  />
);
