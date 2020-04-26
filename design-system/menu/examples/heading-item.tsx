import React from 'react';

import { R300 } from '@atlaskit/theme/colors';

import { HeadingItem } from '../src';

export default () => (
  <>
    <HeadingItem>Actions</HeadingItem>
    <HeadingItem cssFn={css => ({ ...css, color: R300 })}>Actions</HeadingItem>
  </>
);
