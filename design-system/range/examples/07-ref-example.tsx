import React, { Fragment, useEffect, useState } from 'react';

import Range from '../src';

export default () => {
  const [value, setValue] = useState(50);
  const ref = React.createRef<HTMLInputElement>();

  useEffect(() => {
    console.log('new value from ref', ref.current && ref.current.value);
  });

  return (
    <Fragment>
      <Range
        ref={ref}
        step={1}
        value={value}
        onChange={(value) => setValue(value)}
      />
      <p>The current value from ref is being logged</p>
    </Fragment>
  );
};
