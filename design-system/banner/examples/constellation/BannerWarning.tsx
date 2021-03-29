import React from 'react';

import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../../src';

export default () => (
  <Banner
    appearance="warning"
    icon={<WarningIcon label="" secondaryColor="inherit" />}
    isOpen
  >
    Warning goes here
  </Banner>
);
