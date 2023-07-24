import React from 'react';

import { Inline } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Example() {
  return (
    <Inline space="space.100" shouldWrap>
      {[...Array(42).keys()].map(i => (
        <Block key={i}>{i + 1}</Block>
      ))}
    </Inline>
  );
}
