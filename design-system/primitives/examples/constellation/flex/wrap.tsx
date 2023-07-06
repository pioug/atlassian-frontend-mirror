import React from 'react';

import Badge from '@atlaskit/badge';
import { Flex } from '@atlaskit/primitives';

export default function Example() {
  return (
    <Flex gap="space.100" wrap="wrap">
      {[...Array(42).keys()].map(i => (
        <Badge key={i}>{i + 1}</Badge>
      ))}
    </Flex>
  );
}
