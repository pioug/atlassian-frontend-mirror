import React from 'react';

import { SkeletonItem } from '../src';

export default () => (
  <>
    <SkeletonItem />
    <SkeletonItem hasAvatar isShimmering />
    <SkeletonItem hasIcon isShimmering />
  </>
);
