import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import Link from '../src';

const containerStyles = xcss({
  // @ts-ignore
  width: '515px',
});

export default function IconWrappingExample() {
  return (
    // Both link text and icon should be `color.link.visited`.
    <Box xcss={containerStyles}>
      <Link href="https://www.atlassian.com" target="_blank">
        I am a long link with an icon, but the icon does not wrap onto a new
        line by itself
      </Link>
    </Box>
  );
}
