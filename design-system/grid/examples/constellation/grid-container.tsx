import React from 'react';

import Grid, { GridContainer, GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => {
  return (
    <GridContainer hasInlinePadding={true}>
      <Grid>
        <GridItem span={{ md: 6 }}>
          <SkeletonBox>md=6</SkeletonBox>
        </GridItem>
        <GridItem span={{ md: 6 }}>
          <SkeletonBox>md=6</SkeletonBox>
        </GridItem>
        <GridItem span={{ md: 6 }}>
          <SkeletonBox>md=6</SkeletonBox>
        </GridItem>
        <GridItem span={{ md: 6 }}>
          <SkeletonBox>md=6</SkeletonBox>
        </GridItem>
      </Grid>
      <Grid>
        <GridItem span={{ md: 4 }}>
          <SkeletonBox>md=4</SkeletonBox>
        </GridItem>
        <GridItem span={{ md: 8 }}>
          <SkeletonBox>md=8</SkeletonBox>
        </GridItem>
        <GridItem span={{ md: 4 }}>
          <SkeletonBox>md=4</SkeletonBox>
        </GridItem>
        <GridItem span={{ md: 8 }}>
          <SkeletonBox>md=8</SkeletonBox>
        </GridItem>
      </Grid>
      <Grid>
        <GridItem span={{ md: 4 }}>
          <SkeletonBox>md=4</SkeletonBox>
        </GridItem>
        <GridItem span={{ md: 8 }}>
          <SkeletonBox>md=8</SkeletonBox>
        </GridItem>
        <GridItem span={{ md: 4 }}>
          <SkeletonBox>md=4</SkeletonBox>
        </GridItem>
        <GridItem span={{ md: 8 }}>
          <SkeletonBox>md=8</SkeletonBox>
        </GridItem>
      </Grid>
    </GridContainer>
  );
};
