import React from 'react';

import Inline from '@atlaskit/primitives/inline';

import Box from '../src/components/box.partial';
import Text from '../src/components/text.partial';

export default () => {
  return (
    <Inline space="space.100">
      <Box
        paddingBlock="space.400"
        paddingInline="space.400"
        alignItems="center"
        backgroundColor="information"
      >
        <Text>
          <Text>Text that deletes its redundant wrapping</Text>
        </Text>
      </Box>
      <Box
        paddingBlock="space.400"
        paddingInline="space.400"
        alignItems="center"
        backgroundColor="information"
      >
        <Text fontWeight="semibold">Text on information</Text>
      </Box>
      <Box
        paddingBlock="space.400"
        paddingInline="space.400"
        alignItems="center"
        backgroundColor="brand.bold"
      >
        <Text fontWeight="semibold">Text on brand bold</Text>
      </Box>
    </Inline>
  );
};
