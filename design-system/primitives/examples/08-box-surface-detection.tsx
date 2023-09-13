import React from 'react';

import Heading from '@atlaskit/heading';

import { Box, xcss } from '../src';

const containerStyles = xcss({
  position: 'relative',
  width: 'size.1000',
  overflow: 'clip',
});

const headerStyles = xcss({
  position: 'absolute',
  top: 'space.0',
  right: 'space.0',
  left: 'space.0',
  borderBottom: '1px solid',
  borderColor: 'color.border',
  boxShadow: 'elevation.shadow.overflow',
});

export default () => {
  return (
    <Box
      backgroundColor="elevation.surface.raised"
      padding="space.200"
      xcss={containerStyles}
    >
      <Box
        backgroundColor="utility.elevation.surface.current"
        padding="space.200"
        xcss={headerStyles}
      >
        <Heading level="h500">Header overlay</Heading>
      </Box>
      <p>Some text that is partially covered by the header.</p>
    </Box>
  );
};
