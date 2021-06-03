import React, { Fragment, useState } from 'react';

import Range from '../src';

function ControlledRange() {
  const [value, setValue] = useState(50);

  return (
    <Fragment>
      <Range step={1} value={value} onChange={(value) => setValue(value)} />
      <p>The current value is: {value}</p>
    </Fragment>
  );
}

export default ControlledRange;
