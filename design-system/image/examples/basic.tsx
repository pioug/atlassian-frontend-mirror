/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Inline, xcss } from '@atlaskit/primitives';

import Image from '../src';

import Cat from './images/cat.png';

const containerStyles = xcss({
  height: '100%',
});

export default () => (
  <Inline alignBlock="center" alignInline="center" xcss={containerStyles}>
    <Image src={Cat} alt="Simple example" testId="image" />
  </Inline>
);
