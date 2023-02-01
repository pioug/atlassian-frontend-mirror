import React from 'react';

import Grid, { GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => {
  return (
    <Grid>
      <GridItem span={{ xs: 2, sm: 3, md: 6, lg: 6, xl: 6, xxl: 6 }}>
        <SkeletonBox>
          Half width:
          <br />
          xs=2 sm=3 md=6
          <br />
          lg=6 xl=6 xxl=6
        </SkeletonBox>
      </GridItem>

      <GridItem span={{ xs: 4, sm: 6, md: 12, lg: 12, xl: 12, xxl: 12 }}>
        <SkeletonBox>
          Full width:
          <br />
          xs=4 sm=6 md=12
          <br />
          lg=12 xl=12 xxl=12
        </SkeletonBox>
      </GridItem>
    </Grid>
  );
};
