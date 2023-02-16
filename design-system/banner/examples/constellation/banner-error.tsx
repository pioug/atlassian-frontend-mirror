import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';

import Banner from '../../src';

const BannerErrorExample = () => {
  return (
    <Banner
      appearance="error"
      icon={<ErrorIcon label="" secondaryColor="inherit" />}
    >
      Bitbucket is experiencing an incident, but we’re on it. Check our status
      page for more details.{' '}
      <a href="/components/banner/examples">Learn more</a>
    </Banner>
  );
};

export default BannerErrorExample;
