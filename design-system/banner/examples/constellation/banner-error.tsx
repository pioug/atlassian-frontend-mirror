import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';

import Banner from '../../src';

const BannerErrorExample = () => {
  return (
    <Banner
      appearance="error"
      icon={<ErrorIcon label="" secondaryColor="inherit" />}
      isOpen
    >
      Error message goes here
    </Banner>
  );
};

export default BannerErrorExample;
