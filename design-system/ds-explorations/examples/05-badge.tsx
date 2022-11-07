import React from 'react';

import Badge from '@atlaskit/badge';

import { UNSAFE_Box as Box } from '../src';
import Text from '../src/components/text.partial';

export default () => {
  return (
    <>
      <Badge>{8}</Badge>
      <Box
        borderRadius="badge"
        backgroundColor="neutral"
        display="inlineFlex"
        paddingInline="scale.075"
        UNSAFE_style={{ lineHeight: '16px' }}
      >
        <Text fontSize="12px">8</Text>
      </Box>
    </>
  );
};
