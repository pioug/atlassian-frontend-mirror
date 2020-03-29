import React from 'react';
import { CheckboxSelect } from '../src';
import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
const CheckboxExample = () => (
  <CheckboxSelect
    className="checkbox-select"
    classNamePrefix="select"
    options={[
      ...cities,
      {
        label:
          "super long name that no one will ever read because it's way too long to be a realistic option but it will highlight the flexbox grow and shrink styles",
        value: 'test',
      },
    ]}
    placeholder="Choose a City"
  />
);

export default CheckboxExample;
