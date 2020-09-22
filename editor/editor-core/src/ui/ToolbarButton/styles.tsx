import React from 'react';
import Button, { ButtonProps } from '@atlaskit/button/standard-button';

export default (props: ButtonProps) => {
  return <Button {...props} style={{ alignItems: 'center' }} />;
};
