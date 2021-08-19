import React, { Ref, useEffect } from 'react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Tooltip from '../src';

const CustomisedTagWithRef = React.forwardRef((props, ref: Ref<any>) => {
  const { children, ...rest } = props;
  return (
    <div
      {...rest}
      ref={ref}
      style={{
        display: 'inline-block',
        background: token('color.background.boldWarning.resting', 'orange'),
        color: token('color.text.onBoldWarning', '#000000'),
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
