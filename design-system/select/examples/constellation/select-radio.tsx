import React from 'react';
import { RadioSelect } from '../../src';
import { cities } from '../common/data';

const SelectRadioExample = () => (
  <>
    <label htmlFor="radio-select-example">What city do you live in?</label>
    <RadioSelect
      inputId="radio-select-example"
      className="radio-select"
      classNamePrefix="react-select"
      options={[
        ...cities,
        {
          label:
            "Super long name that no one will ever read because it's way too long",
          value: 'test',
        },
      ]}
      placeholder="Choose a city"
    />
  </>
);

export default SelectRadioExample;
