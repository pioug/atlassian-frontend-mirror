import React from 'react';

import { Box, Stack, xcss } from '@atlaskit/primitives';

const listStyles = xcss({
  paddingInlineStart: 'space.0',
});

const boxStyles = xcss({
  color: 'color.text.inverse',
  backgroundColor: 'color.background.success.bold',
  padding: 'space.100',
  borderRadius: 'border.radius.100',
  transitionDuration: '200ms',
  listStyle: 'none',
  '::before': {
    content: '"✨"',
    paddingInlineEnd: 'space.050',
  },
  '::after': {
    content: '"✨"',
    paddingInlineStart: 'space.050',
  },
  ':hover': {
    backgroundColor: 'color.background.success.bold.hovered',
    transform: 'scale(1.02)',
  },
});

export default function Example() {
  return (
    <Stack as="ul" xcss={listStyles}>
      <Box xcss={boxStyles} as="li">
        Hover over me
      </Box>
      <Box xcss={boxStyles} as="li">
        Hover over me
      </Box>
      <Box xcss={boxStyles} as="li">
        Hover over me
      </Box>
      <Box xcss={boxStyles} as="li">
        Hover over me
      </Box>
    </Stack>
  );
}
