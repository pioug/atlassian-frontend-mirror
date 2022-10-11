import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';

import Banner from '../src';

const Icon = <ErrorIcon label="" secondaryColor="inherit" />;

export default () => (
  <Banner icon={Icon} appearance="error">
    {/* eslint-disable-next-line @repo/internal/react/use-primitives */}
    This is an error banner with a <a href="http://atlassian.com">link</a>
  </Banner>
);
