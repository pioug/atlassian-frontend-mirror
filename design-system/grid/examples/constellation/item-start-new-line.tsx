import React from 'react';

import Grid, { GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => (
  <Grid>
    <GridItem span={4}>
      <SkeletonBox>Line 1</SkeletonBox>
    </GridItem>

    <GridItem span={4} start={1}>
      <SkeletonBox>Forced to Line 2</SkeletonBox>
    </GridItem>
  </Grid>
);
