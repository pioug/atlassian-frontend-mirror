import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

const boxStyles = xcss({
  borderColor: 'color.border.discovery',
  borderStyle: 'solid',
  borderRadius: 'border.radius',
  borderWidth: 'border.width',
});

export default function Example() {
  return (
    <Box
      padding="space.400"
      backgroundColor="color.background.discovery"
      xcss={boxStyles}
    ></Box>
  );
}
