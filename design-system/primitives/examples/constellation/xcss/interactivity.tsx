import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Stack, xcss } from '@atlaskit/primitives';

const textStyles = xcss({
  color: 'color.text',
});

const cardStyles = xcss({
  backgroundColor: 'elevation.surface',
  padding: 'space.200',
  borderColor: 'color.border',
  borderWidth: 'width.100',
  borderStyle: 'solid',
  borderRadius: 'radius.100',
  ':hover': {
    backgroundColor: 'elevation.surface.hovered',
  },
  ':focus-visible': {
    outline: '2px solid',
    outlineOffset: 'space.025',
    outlineColor: 'focused',
  },
});

const InteractiveCard = () => (
  <Box xcss={cardStyles} tabIndex={0}>
    <Stack space="space.100">
      <Heading level="h600">A Card</Heading>
      <Box xcss={textStyles}>With a description.</Box>
    </Stack>
  </Box>
);

export default InteractiveCard;
