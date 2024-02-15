/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Inline, xcss } from '@atlaskit/primitives';

import Image from '../src';

import Dark from './images/dark-mode-cat.png';
import Light from './images/light-mode-cat.png';

const containerStyles = xcss({
  height: '100%',
});

export default () => (
  <Inline alignBlock="center" alignInline="center" xcss={containerStyles}>
    <Image src={Light} srcDark={Dark} alt="Theming in action" testId="image" />
  </Inline>
);
