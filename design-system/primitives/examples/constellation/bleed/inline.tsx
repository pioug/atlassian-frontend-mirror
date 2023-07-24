import React from 'react';

import { Bleed, Box, Inline } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Basic() {
  return (
    <Box padding="space.200" backgroundColor="color.background.neutral">
      <Inline space="space.100">
        <Block />
        <Block />
        <Bleed inline="space.150">
          <Block
            style={{ position: 'relative' }}
            backgroundColor="color.background.discovery.pressed"
          />
        </Bleed>
        <Block />
        <Block />
      </Inline>
    </Box>
  );
}
