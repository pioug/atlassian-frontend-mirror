import React from 'react';
import { CheckboxSelect } from '../../src';
import { cities } from '../common/data';

export default () => (
  <CheckboxSelect
    className="checkbox-select"
    classNamePrefix="select"
    options={[
      ...cities,
      {
        label:
          "Super long name that no one will ever read because it's way too long to be a realistic option but it will highlight the flexbox grow and shrink styles",
        value: 'test',
      },
    ]}
    placeholder="Choose a city"
  />
);
