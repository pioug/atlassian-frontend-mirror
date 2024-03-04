import React from 'react';

import { Box, Inline, Text, xcss } from '@atlaskit/primitives';

const boxStyles = xcss({
  display: 'flex',
  paddingBlock: 'space.400',
  paddingInline: 'space.400',
  alignItems: 'center',
});

export default () => {
  return (
    <Inline space="space.100">
      <Box xcss={boxStyles} backgroundColor="color.background.information">
        <Text>Text on information</Text>
      </Box>
      <Box xcss={boxStyles} backgroundColor="color.background.brand.bold">
        <Text>Text color automatically inverted</Text>
      </Box>
    </Inline>
  );
};
