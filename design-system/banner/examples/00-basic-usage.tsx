import React from 'react';

import WarningIcon from '@atlaskit/icon/glyph/warning';
import Box from '@atlaskit/primitives/box';

import Banner from '../src';

export default () => (
  <Box>
    <Banner
      icon={<WarningIcon label="" secondaryColor="inherit" size="medium" />}
    >
      Your license is about to expire. Please renew your license within the next
      week.
    </Banner>
  </Box>
);
