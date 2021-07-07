import React from 'react';

import Range from '../../src';

const RangeUncontrolledExample = () => {
  return (
    <Range step={1} onChange={(value) => console.log('new value', value)} />
  );
};

export default RangeUncontrolledExample;
