import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';

import Banner from '../../src';

const BannerErrorExample = () => {
  return (
    <Banner
      appearance="error"
      icon={<ErrorIcon label="Error" secondaryColor="inherit" />}
    >
      Bitbucket is experiencing an incident. Check our status
      page for more details.{' '}
      <a href="http://www.bitbucket.com">Status page</a>
    </Banner>
  );
};

export default BannerErrorExample;
