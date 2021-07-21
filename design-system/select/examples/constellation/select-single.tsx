import React from 'react';
import Select from '../../src';

const SelectSingleExample = () => (
  <>
    <label htmlFor="single-select-example">What city do you live in?</label>
    <Select
      inputId="single-select-example"
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
      placeholder="Choose a city"
    />
  </>
);

export default SelectSingleExample;
