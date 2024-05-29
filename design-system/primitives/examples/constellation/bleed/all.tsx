import React from 'react';

import { Bleed, Box, Grid } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Basic() {
  return (
    <Box padding="space.200" backgroundColor="color.background.neutral">
      <Grid templateColumns="1fr 1fr 1fr" gap="space.100">
        <ExampleBox />
        <ExampleBox />
        <ExampleBox />
        <ExampleBox />
        <Bleed all="space.150">
          <ExampleBox
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
            style={{ height: '100%', position: 'relative' }}
            backgroundColor="color.background.discovery.pressed"
          />
        </Bleed>
        <ExampleBox />
        <ExampleBox />
        <ExampleBox />
        <ExampleBox />
      </Grid>
    </Box>
  );
}
