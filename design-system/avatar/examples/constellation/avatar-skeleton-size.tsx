import React from 'react';

import { Skeleton } from '../../src';

export default function AvatarSkeletonSizeExample() {
  return (
    <div>
      <Skeleton size="xsmall" />
      <Skeleton size="small" />
      <Skeleton size="medium" />
      <Skeleton size="large" />
      <Skeleton size="xlarge" />
      <Skeleton size="xxlarge" />
    </div>
  );
}
