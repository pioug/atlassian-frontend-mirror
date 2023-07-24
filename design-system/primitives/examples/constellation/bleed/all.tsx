import React from 'react';

import { Bleed, Box, Grid } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Basic() {
  return (
    <Box padding="space.200" backgroundColor="color.background.neutral">
      <Grid templateColumns="1fr 1fr 1fr" gap="space.100">
        <Block />
        <Block />
        <Block />
        <Block />
        <Bleed all="space.150">
          <Block
            style={{ height: '100%', position: 'relative' }}
            backgroundColor="color.background.discovery.pressed"
          />
        </Bleed>
        <Block />
        <Block />
        <Block />
        <Block />
      </Grid>
    </Box>
  );
}
