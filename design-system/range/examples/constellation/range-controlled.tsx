import React, { useState } from 'react';

import Range from '../../src';

const RangeControlledExample = () => {
  const [value, setValue] = useState(50);

  return (
    <>
      <Range step={1} value={value} onChange={(value) => setValue(value)} />
      <p>The current value is: {value}</p>
    </>
  );
};

export default RangeControlledExample;
