import React from 'react';

import Grid, { GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => {
  return (
    <Grid>
      <GridItem span={{ md: 4 }}>
        <SkeletonBox>md=4</SkeletonBox>
      </GridItem>
      <GridItem span={{ md: 4 }}>
        <SkeletonBox>md=4</SkeletonBox>
      </GridItem>
      <GridItem span={{ md: 4 }}>
        <SkeletonBox>md=4</SkeletonBox>
      </GridItem>

      <GridItem span={{ md: 6 }}>
        <Grid>
          <GridItem span={{ md: 6 }}>
            <SkeletonBox>md=6 | md=6</SkeletonBox>
          </GridItem>
          <GridItem span={{ md: 6 }}>
            <SkeletonBox>md=6 | md=6</SkeletonBox>
          </GridItem>
        </Grid>
      </GridItem>

      <GridItem span={{ md: 6 }}>
        <Grid>
          <GridItem span={{ md: 6 }}>
            <SkeletonBox>md=6 | md=6</SkeletonBox>
          </GridItem>
          <GridItem span={{ md: 6 }}>
            <SkeletonBox>md=6 | md=6</SkeletonBox>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};
