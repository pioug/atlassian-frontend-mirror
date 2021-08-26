/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { R300 } from '@atlaskit/theme/colors';

import { HeadingItem } from '../src';

const Example = () => (
  <>
    <HeadingItem>Actions</HeadingItem>
    <HeadingItem cssFn={() => ({ color: R300 })}>Actions</HeadingItem>
  </>
);

export default Example;
