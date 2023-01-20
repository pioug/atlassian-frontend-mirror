import React, { FC } from 'react';

import Box from '@atlaskit/ds-explorations/box';

import Grid, { GridItem } from '../../src';

const SkeletonBox: FC = ({ children }) => (
  <Box
    UNSAFE_style={{ textAlign: 'center' }}
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
      <GridItem>
        <Grid>
          <GridItem span={{ md: 3 }}>
            <SkeletonBox>Nested First</SkeletonBox>
          </GridItem>
          <GridItem span={{ md: 3 }}>
            <SkeletonBox>Nested Second</SkeletonBox>
          </GridItem>
          <GridItem span={{ md: 3 }}>
            <SkeletonBox>Nested Third</SkeletonBox>
          </GridItem>
          <GridItem span={{ md: 3 }}>
            <SkeletonBox>Nested Fourth</SkeletonBox>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};
