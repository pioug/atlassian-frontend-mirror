import React from 'react';

import Box from '../src/components/box.partial';
import Inline from '../src/components/inline.partial';
import Text from '../src/components/text.partial';

export default () => {
  return (
    <Inline gap="scale.100">
      <Box
        paddingBlock="scale.400"
        paddingInline="scale.400"
        alignItems="center"
        backgroundColor="information"
      >
        <Text>
          <Text>Text that deletes its redundant wrapping</Text>
        </Text>
      </Box>
      <Box
        paddingBlock="scale.400"
        paddingInline="scale.400"
        alignItems="center"
        backgroundColor="information"
      >
        <Text fontWeight="600">Text on information</Text>
      </Box>
      <Box
        paddingBlock="scale.400"
        paddingInline="scale.400"
        alignItems="center"
        backgroundColor="brand.bold"
      >
        <Text fontWeight="600">Text on brand bold</Text>
      </Box>
    </Inline>
  );
};
