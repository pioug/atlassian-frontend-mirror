import React from 'react';
import Range from '../src';

const SimpleRange = () => (
  <Range step={1} onChange={e => console.log('updated range', e)} />
);

export default SimpleRange;
