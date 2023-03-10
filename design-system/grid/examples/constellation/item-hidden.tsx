import React, { Fragment, useState } from 'react';

import Grid, { GridItem } from '../../src';

import { SkeletonBox } from './shared/skeleton-box';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <Fragment>
      <Grid>
        <GridItem>
          <button type="button" onClick={() => setVisible((v) => !v)}>
            toggle visibility to {visible ? 'hidden' : 'visible'}
          </button>
        </GridItem>

        <GridItem span={6}>
          <SkeletonBox>always visible</SkeletonBox>
        </GridItem>

        <GridItem span={{ xxs: 'none', md: 6 }}>
          <SkeletonBox>hidden below md</SkeletonBox>
        </GridItem>

        <GridItem span={{ xxs: 6, lg: 'none' }}>
          <SkeletonBox>hidden above lg</SkeletonBox>
        </GridItem>

        <GridItem span={visible ? 6 : 'none'}>
          <SkeletonBox>only visible when toggled</SkeletonBox>
        </GridItem>

        <GridItem span={6}>
          <SkeletonBox>always visible</SkeletonBox>
        </GridItem>
      </Grid>
    </Fragment>
  );
};
