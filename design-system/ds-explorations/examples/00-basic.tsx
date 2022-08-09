import React from 'react';

import Box from '../src/components/box.partial';
import Text from '../src/components/text.partial';

export default () => {
  return (
    <Box>
      <Box
        paddingBlock="sp-400"
        paddingInline="sp-400"
        alignItems="center"
        backgroundColor={['brand.bold', 'blue']}
        UNSAFE_style={{ aspectRatio: '1/1' }}
      >
        <Text fontWeight="500" color={['inverse', 'white']}>
          A basic box
        </Text>
      </Box>
    </Box>
  );
};
