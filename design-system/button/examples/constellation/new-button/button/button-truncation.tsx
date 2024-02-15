import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import Button from '../../../../src/new';
const containerStyles = xcss({
  maxWidth: 'size.1000',
});

const ButtonTruncationExample = () => {
  return (
    <Box xcss={containerStyles}>
      <Button>This text is truncated to fit within the container</Button>
    </Box>
  );
};

export default ButtonTruncationExample;
