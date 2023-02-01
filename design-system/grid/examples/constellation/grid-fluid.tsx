import React from 'react';

import Grid, { GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => {
  return (
    <Grid width="fluid">
      <GridItem span={{ sm: 2, md: 4 }}>
        <SkeletonBox>sm=6 md=4</SkeletonBox>
      </GridItem>
      <GridItem span={{ sm: 2, md: 4 }}>
        <SkeletonBox>sm=2 md=4</SkeletonBox>
      </GridItem>
      <GridItem span={{ sm: 2, md: 4 }}>
        <SkeletonBox>sm=2 md=4</SkeletonBox>
      </GridItem>
      <GridItem span={{ md: 6 }}>
        <SkeletonBox>md=6</SkeletonBox>
      </GridItem>
      <GridItem span={{ md: 6 }}>
        <SkeletonBox>md=6</SkeletonBox>
      </GridItem>
    </Grid>
  );
};
