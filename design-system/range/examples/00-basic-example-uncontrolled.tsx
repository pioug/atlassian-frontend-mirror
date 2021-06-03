import React from 'react';

import Range from '../src';

const SimpleRange = () => (
  <Range step={1} onChange={(value) => console.log('new value', value)} />
);

export default SimpleRange;
