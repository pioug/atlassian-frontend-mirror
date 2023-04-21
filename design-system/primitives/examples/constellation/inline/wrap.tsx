import React from 'react';

import Badge from '@atlaskit/badge';
import { Inline } from '@atlaskit/primitives';

export default function Example() {
  return (
    <Inline space="space.100" shouldWrap>
      {[...Array(42).keys()].map(i => (
        <Badge key={i}>{i + 1}</Badge>
      ))}
    </Inline>
  );
}
