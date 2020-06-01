import React from 'react';
import { RadioSelect } from '../../src';
import { cities } from '../common/data';

export default () => (
  <RadioSelect
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
);
