import React, { Ref, useEffect } from 'react';

import Button from '@atlaskit/button/custom-theme-button';

import Tooltip from '../src';

const CustomisedTagWithRef = React.forwardRef((props, ref: Ref<any>) => {
  const { children, ...rest } = props;
  return (
    <div
      {...rest}
      ref={ref}
      style={{
        display: 'inline-block',
        background: 'orange',
      }}
    >
      {children}
    </div>
  );
});

export default () => {
  const ref = React.createRef();

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current);
    }
  });

  return (
    <Tooltip content="Hello World" tag={CustomisedTagWithRef}>
      <Button>Hover Over Me</Button>
    </Tooltip>
  );
};
