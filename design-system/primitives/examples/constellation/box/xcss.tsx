import React from 'react';

import { Box, Stack, xcss } from '@atlaskit/primitives';

const boxStyles = xcss({
  color: 'inverse',
  backgroundColor: 'success.bold',
  padding: 'space.100',
  borderRadius: 'radius.100',
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
    backgroundColor: 'success.bold.hovered',
    transform: 'scale(1.02)',
  },
});

export default function Example() {
  return (
    <Stack as="ul">
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
