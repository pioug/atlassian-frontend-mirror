import React from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Banner from '../src';

export default () => (
  <Banner
    icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}
    isOpen
    testId="myBannerTestId"
  >
    Your Banner is rendered with a [data-testid="myBannerTestId"].
  </Banner>
);
