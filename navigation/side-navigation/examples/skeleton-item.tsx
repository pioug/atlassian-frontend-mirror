import React from 'react';

import { SkeletonItem } from '../src';

const Example = () => (
  <>
    <SkeletonItem />
    <SkeletonItem hasAvatar />
    <SkeletonItem hasIcon isShimmering />
    <SkeletonItem isShimmering />
  </>
);

export default Example;
