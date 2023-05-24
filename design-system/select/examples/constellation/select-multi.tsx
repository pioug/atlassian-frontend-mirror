import React from 'react';
import { Label } from '@atlaskit/form';
import Select from '../../src';
import { cities } from '../common/data';

const SelectMultiExample = () => (
  <>
    <Label htmlFor="multi-select-example">What cities have you lived in?</Label>
    <Select
      inputId="multi-select-example"
      className="multi-select"
      classNamePrefix="react-select"
      options={cities}
      isMulti
      isSearchable={false}
      placeholder="Choose a city"
    />
  </>
);

export default SelectMultiExample;
