import React from 'react';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Banner from '../src';

const Icon = <ErrorIcon label="Error icon" secondaryColor="inherit" />;

export default () => (
  <Banner icon={Icon} isOpen appearance="error">
    This is an error banner
  </Banner>
);
