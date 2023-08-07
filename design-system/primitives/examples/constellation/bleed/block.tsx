import React from 'react';

import { Bleed, Box, Stack } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Basic() {
  return (
    <Box padding="space.200" backgroundColor="color.background.neutral">
      <Stack space="space.100">
        <ExampleBox />
        <ExampleBox />
        <Bleed block="space.150">
          <ExampleBox
            style={{ position: 'relative' }}
            backgroundColor="color.background.discovery.pressed"
          />
        </Bleed>
        <ExampleBox />
        <ExampleBox />
      </Stack>
    </Box>
  );
}
