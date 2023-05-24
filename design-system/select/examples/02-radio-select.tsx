import React from 'react';

import { Label } from '@atlaskit/form';

import { RadioSelect } from '../src';
import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
const RadioExample = () => (
  <>
    <Label htmlFor="radio-select-example">What city do you live in?</Label>
    <RadioSelect
      inputId="radio-select-example"
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
  </>
);

export default RadioExample;
