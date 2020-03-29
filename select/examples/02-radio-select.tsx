import React from 'react';
import { RadioSelect } from '../src';
import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
const RadioExample = () => (
  <RadioSelect
    className="radio-select"
    classNamePrefix="react-select"
    options={[
      ...cities,
      {
        label:
          "super long name that noone will ever read because it's way too long",
        value: 'test',
      },
    ]}
    placeholder="Choose a City"
  />
);

export default RadioExample;
