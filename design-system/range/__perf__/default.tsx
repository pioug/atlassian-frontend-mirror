import React from 'react';

import Range from '../src';

export default () => (
  <Range step={1} onChange={(value) => console.log('new value', value)} />
);
