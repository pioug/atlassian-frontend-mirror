import React from 'react';

import { Inline, xcss } from '@atlaskit/primitives';

import Image from '../../src';
import Cat from '../images/cat.png';

const containerStyles = xcss({
  height: '100%',
});

const ImageDefaultExample = () => {
  return (
    <Inline alignBlock="center" alignInline="center" xcss={containerStyles}>
      <Image src={Cat} alt="Simple example" testId="image" />
    </Inline>
  );
};

export default ImageDefaultExample;
