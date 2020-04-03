import React from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Banner from '../src';

export default () => (
  <Banner
    icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}
    isOpen
  >
    Your license is about to expire. Please renew your license within the next
    week.
  </Banner>
);
