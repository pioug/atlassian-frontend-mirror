import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import { UNSAFE_BUTTON } from '../../../../src';

const containerStyles = xcss({
  maxWidth: 'size.1000',
});

const ButtonTruncationExample = () => {
  return (
    <Box xcss={containerStyles}>
      <UNSAFE_BUTTON>
        This text is truncated to fit within the container
      </UNSAFE_BUTTON>
    </Box>
  );
};

export default ButtonTruncationExample;
