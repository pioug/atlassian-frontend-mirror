import React from 'react';

import { Inline } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Example() {
  return (
    <Inline space="space.100" shouldWrap>
      {[...Array(42).keys()].map(i => (
        <ExampleBox key={i}>{i + 1}</ExampleBox>
      ))}
    </Inline>
  );
}
