import React from 'react';

import { Box, Inline, xcss } from '../src';

const containerStyles = xcss({ display: 'flex', flexDirection: 'row' });

const boxStyles = xcss({
  backgroundColor: 'color.background.danger',
  border: '2px solid rebeccapurple',
  padding: 'space.200',
  borderRadius: 'border.radius.050',
});

const defaultStyles = xcss({
  backgroundColor: 'color.background.success',
  border: '2px solid green',
  borderRadius: 'border.radius.050',
});

export default () => (
  <Box xcss={containerStyles} padding="space.100">
    <Inline space="space.100" testId="classname-examples">
      <Box
        backgroundColor="color.background.discovery.bold"
        padding="space.200"
        xcss={boxStyles}
      />
      <Box
        backgroundColor="color.background.discovery.bold"
        padding="space.200"
        xcss={defaultStyles}
      />
    </Inline>
  </Box>
);
