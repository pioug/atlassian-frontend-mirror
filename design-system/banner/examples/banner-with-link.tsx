import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';

import Banner from '../src';

const Icon = <ErrorIcon label="" secondaryColor="inherit" />;

export default () => (
  <Banner icon={Icon} appearance="error">
    {/* TODO: Use descriptive text for link (DSP-11466) */}
    {/* eslint-disable-next-line jsx-a11y/anchor-ambiguous-text */}
    This is an error banner with a <a href="http://atlassian.com">link</a>
  </Banner>
);
