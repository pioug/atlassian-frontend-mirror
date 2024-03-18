import React from 'react';

import { Grid, xcss } from '@atlaskit/primitives';
import { media } from '@atlaskit/primitives/responsive';

import ExampleBox from '../shared/example-box';

const responsiveStyles = xcss({
  [media.above.xxs]: { gridTemplateColumns: 'repeat(1, 1fr)' },
  [media.above.xs]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [media.above.sm]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [media.above.lg]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
});

const ResponsiveGrid = () => {
  return (
    <Grid xcss={responsiveStyles} gap="space.200" alignItems="center">
      <ExampleBox />
      <ExampleBox />
      <ExampleBox />
      <ExampleBox />
    </Grid>
  );
};

export default ResponsiveGrid;
