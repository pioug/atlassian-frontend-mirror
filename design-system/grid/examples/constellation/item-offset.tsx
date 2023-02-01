import React from 'react';

import Grid, { GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => {
  return (
    <Grid>
      <GridItem
        span={{ xs: 2, sm: 4, md: 8, lg: 6, xxl: 4 }}
        offset={{ xs: 1, sm: 1, md: 2, lg: 3, xxl: 4 }}
      >
        <SkeletonBox>Centered</SkeletonBox>
      </GridItem>

      <GridItem
        span={{ xs: 3, sm: 6, md: 11 }}
        offset={{ xs: 1, sm: 1, md: 1, lg: 1, xxl: 1 }}
      >
        <SkeletonBox>Indented</SkeletonBox>
      </GridItem>
    </Grid>
  );
};
