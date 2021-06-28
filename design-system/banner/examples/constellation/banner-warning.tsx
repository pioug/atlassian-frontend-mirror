import React from 'react';

import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../../src';

const BannerWarningExample = () => {
  return (
    <Banner
      appearance="warning"
      icon={<WarningIcon label="" secondaryColor="inherit" />}
      isOpen
    >
      Warning goes here
    </Banner>
  );
};

export default BannerWarningExample;
