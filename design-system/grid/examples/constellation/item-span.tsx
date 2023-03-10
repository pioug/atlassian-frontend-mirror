import React from 'react';

import Grid, { GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => (
  <Grid>
    <GridItem span={6}>
      <SkeletonBox>half-width</SkeletonBox>
    </GridItem>

    <GridItem span={{ xxs: 12 }}>
      <SkeletonBox>full-width</SkeletonBox>
    </GridItem>

    <GridItem>
      <SkeletonBox>full-width (default)</SkeletonBox>
    </GridItem>
  </Grid>
);
