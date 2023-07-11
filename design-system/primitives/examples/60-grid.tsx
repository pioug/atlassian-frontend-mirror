import React from 'react';

import { Box, Grid, xcss } from '../src';

const customBorderStyles = xcss({
  borderColor: 'color.border',
  borderStyle: 'dashed',
  borderWidth: 'border.width.outline',
  borderRadius: 'border.radius',
});

const Square = ({ style }: any) => (
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
      <Grid
        testId="grid-basic"
        rowGap="space.200"
        columnGap="space.400"
        templateColumns="1fr 100px 1fr"
      >
        <Square />
        <Square />
        <Square />
        <Square />
        <Square />
        <Square />
      </Grid>
      <Grid
        testId="grid-basic"
        rowGap="space.200"
        columnGap="space.400"
        templateRows="200px 100px 200px"
      >
        <Square />
        <Square />
        <Square />
      </Grid>
      <Grid
        testId="grid-basic"
        gap="space.200"
        templateAreas={[
          'navigation navigation',
          'sidenav content',
          'footer footer',
        ]}
      >
        <Square style={{ gridArea: 'navigation' }} />
        <Square style={{ gridArea: 'sidenav' }} />
        <Square style={{ gridArea: 'content' }} />
        <Square style={{ gridArea: 'footer' }} />
      </Grid>
    </Grid>
  );
}
