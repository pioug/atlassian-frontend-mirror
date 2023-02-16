import React from 'react';

import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../../src';

const BannerWarningExample = () => {
  return (
    <Banner
      appearance="warning"
      icon={<WarningIcon label="" secondaryColor="inherit" />}
    >
      Payment details needed. To stay on your current plan after your trial
      ends, add payment details by June 30, 2020.{' '}
      <a href="/components/banner/examples">Add payment details</a>
    </Banner>
  );
};

export default BannerWarningExample;
