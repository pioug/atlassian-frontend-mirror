import React from 'react';

import { Box, Inline, xcss } from '@atlaskit/primitives';

import Text from '../src/components/text.partial';

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
        <Text>
          <Text>Text that deletes its redundant wrapping</Text>
        </Text>
      </Box>
      <Box xcss={boxStyles} backgroundColor="color.background.information">
        <Text fontWeight="semibold">Text on information</Text>
      </Box>
      <Box xcss={boxStyles} backgroundColor="color.background.brand.bold">
        <Text fontWeight="semibold">Text on brand bold</Text>
      </Box>
    </Inline>
  );
};
