import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import Image from '../../src';
import Cat from '../images/cat.png';

const containerStyles = xcss({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

const ImageDefaultExample = () => {
  return (
    <Box xcss={containerStyles}>
      <Image src={Cat} alt="Simple example" testId="image" />
    </Box>
  );
};

export default ImageDefaultExample;
