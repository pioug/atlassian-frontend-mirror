import React from 'react';

import Badge from '@atlaskit/badge';

import Box from '../src/components/box.partial';
import Text from '../src/components/text.partial';

export default () => {
  return (
    <>
      <Badge>{8}</Badge>
      <Box
        borderRadius="badge"
        backgroundColor="neutral"
        display="inlineFlex"
        paddingInline="sp-75"
        style={{ lineHeight: '16px' }}
      >
        <Text fontSize="small">8</Text>
      </Box>
    </>
  );
};
