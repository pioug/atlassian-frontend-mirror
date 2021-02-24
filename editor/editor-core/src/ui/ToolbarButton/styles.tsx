import React from 'react';
import Button, { ButtonProps } from '@atlaskit/button/standard-button';

export default React.forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  return <Button ref={ref} {...props} style={{ alignItems: 'center' }} />;
});
