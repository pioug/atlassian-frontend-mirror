import React from 'react';
import Select from '../src';
import { cities } from './common/data';

const DisabledSelects = () => (
  <>
    Single
    <Select
      isDisabled
      className="single-select"
      classNamePrefix="react-select"
      options={[
        { label: 'Adelaide', value: 'adelaide' },
        { label: 'Brisbane', value: 'brisbane' },
        { label: 'Canberra', value: 'canberra' },
        { label: 'Darwin', value: 'darwin' },
        { label: 'Hobart', value: 'hobart' },
        { label: 'Melbourne', value: 'melbourne' },
        { label: 'Perth', value: 'perth' },
        { label: 'Sydney', value: 'sydney' },
      ]}
      placeholder="Choose a City"
    />
    Multi
    <Select
      isDisabled
      className="multi-select"
      classNamePrefix="react-select"
      options={cities}
      isMulti
      isSearchable={false}
      placeholder="Choose a City"
    />
  </>
);

export default DisabledSelects;
