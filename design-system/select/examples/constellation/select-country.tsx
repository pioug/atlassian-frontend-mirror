import React from 'react';
import { CountrySelect } from '../../src';

const CountrySelectExample = () => (
  <>
    <label htmlFor="country-select-example">What country do you live in?</label>
    <CountrySelect inputId="country-select-example" placeholder="Country" />
  </>
);

export default CountrySelectExample;
