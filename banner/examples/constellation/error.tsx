import React from 'react';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Banner from '../../src';

export default function ErrorDemo() {
  return (
    <Banner
      isOpen
      icon={<ErrorIcon label="Error icon" secondaryColor="inherit" />}
      appearance="error"
    >
      Error goes here
    </Banner>
  );
}
