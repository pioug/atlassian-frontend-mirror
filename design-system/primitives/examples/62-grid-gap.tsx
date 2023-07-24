import React from 'react';

import { Box, Grid, xcss } from '@atlaskit/primitives';

const customBorderStyles = xcss({
  borderColor: 'color.border',
  borderStyle: 'dashed',
  borderWidth: 'border.width.outline',
  borderRadius: 'border.radius',
});

const Block = ({ style }: any) => (
  <Box
    xcss={customBorderStyles}
    style={style}
    backgroundColor="color.background.neutral"
    padding="space.600"
  />
);

export default function Basic() {
  return (
    <Grid gap="space.200" alignItems="center">
      <Grid testId="grid-basic" gap="space.100">
        <Block />
        <Block />
        <Block />
      </Grid>
      <Grid testId="grid-basic" gap="space.200">
        <Block />
        <Block />
        <Block />
      </Grid>
      <Grid testId="grid-basic" gap="space.400">
        <Block />
        <Block />
        <Block />
      </Grid>
    </Grid>
  );
}
