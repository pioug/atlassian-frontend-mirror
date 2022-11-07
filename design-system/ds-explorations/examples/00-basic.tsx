import React from 'react';

import Box from '../src/components/box.partial';
import Text from '../src/components/text.partial';

export default () => {
  return (
    <Box>
      <Box
        paddingBlock="scale.400"
        paddingInline="scale.400"
        alignItems="center"
        backgroundColor="brand.bold"
        UNSAFE_style={{ aspectRatio: '1/1' }}
      >
        <Text fontWeight="500" color="inverse">
          A basic box
        </Text>
      </Box>
    </Box>
  );
};
