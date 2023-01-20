import React, { FC } from 'react';

import Box from '@atlaskit/ds-explorations/box';

import Grid, { GridItem } from '../../src';

const SkeletonBox: FC = ({ children }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    backgroundColor="elevation.surface.sunken"
    borderColor="color.border"
    borderWidth="3px"
    borderStyle="solid"
    height="size.600"
  >
    {children}
  </Box>
);

export default () => {
  return (
    <Grid>
      <GridItem span={{ md: 4 }}>
        <SkeletonBox>First</SkeletonBox>
      </GridItem>
      <GridItem span={{ md: 4 }}>
        <SkeletonBox>Second</SkeletonBox>
      </GridItem>
      <GridItem span={{ md: 4 }}>
        <SkeletonBox>Third</SkeletonBox>
      </GridItem>
      <GridItem span={{ md: 4 }}>
        <SkeletonBox>Fourth</SkeletonBox>
      </GridItem>
      <GridItem span={{ md: 4 }}>
        <SkeletonBox>Fifth</SkeletonBox>
      </GridItem>
      <GridItem span={{ md: 4 }}>
        <SkeletonBox>Sixth</SkeletonBox>
      </GridItem>
    </Grid>
  );
};
