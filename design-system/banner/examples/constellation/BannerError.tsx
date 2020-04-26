import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';

import Banner from '../../src';

export default () => (
  <Banner
    appearance="error"
    icon={<ErrorIcon label="Error icon" secondaryColor="inherit" />}
    isOpen
  >
    Error message goes here
  </Banner>
);
