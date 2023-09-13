import React from 'react';

import Badge from '@atlaskit/badge';
import { Box, xcss } from '@atlaskit/primitives';

import Text from '../src/components/text.partial';

const containerStyles = xcss({
  borderRadius: 'border.radius.200',
  display: 'inlineFlex',
  lineHeight: '16px',
});

export default () => {
  return (
    <>
      <Badge>{8}</Badge>
      <Box
        xcss={containerStyles}
        backgroundColor="color.background.neutral"
        paddingInline="space.075"
      >
        <Text fontSize="size.075">8</Text>
      </Box>
    </>
  );
};
