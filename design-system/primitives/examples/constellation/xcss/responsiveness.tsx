/* eslint-disable @repo/internal/styles/no-nested-styles */
import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Stack, xcss } from '@atlaskit/primitives';
import { media } from '@atlaskit/primitives/responsive';

const textStyles = xcss({
  color: 'color.text',
});

const cardStyles = xcss({
  backgroundColor: 'color.background.neutral',
  padding: 'space.200',
  borderColor: 'color.border',
  borderWidth: 'border.width.outline',
  borderStyle: 'solid',
  borderRadius: 'border.radius.050',
  [media.above.xxs]: {
    backgroundColor: 'color.background.accent.red.subtler',
  },
  [media.above.xs]: {
    backgroundColor: 'color.background.accent.yellow.subtler',
  },
  [media.above.sm]: {
    backgroundColor: 'color.background.accent.green.subtler',
  },
  [media.above.md]: {
    backgroundColor: 'color.background.accent.orange.subtler',
  },
  [media.above.lg]: {
    backgroundColor: 'color.background.accent.magenta.subtler',
  },
});

const ResponsiveCard = () => (
  <Box xcss={cardStyles} tabIndex={0}>
    <Stack space="space.100">
      <Heading level="h600">A Responsive Card</Heading>
      <Box xcss={textStyles}>
        Change your screen width to see me change color.
      </Box>
    </Stack>
  </Box>
);

export default ResponsiveCard;
