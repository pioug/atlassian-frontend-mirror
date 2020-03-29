import React, { Fragment } from 'react';
import Range from '../src';

const CustomValues = () => (
  <Fragment>
    <Range
      defaultValue={480}
      min={40}
      max={500}
      step={20}
      onChange={value => console.log('new value', value)}
    />
    <p>
      This range has a minimum of 40, a maximum of 500, a default value of 480 ,
      and a step of 20. If you want to experiment with custom values, check out
      the playground.
    </p>
  </Fragment>
);

export default CustomValues;
