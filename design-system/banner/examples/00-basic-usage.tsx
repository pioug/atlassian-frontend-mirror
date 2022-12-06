import React from 'react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../src';

export default () => (
  <Box display="block">
    <Banner
      icon={<WarningIcon label="" secondaryColor="inherit" size="medium" />}
    >
      Your license is about to expire. Please renew your license within the next
      week.
    </Banner>
  </Box>
);
