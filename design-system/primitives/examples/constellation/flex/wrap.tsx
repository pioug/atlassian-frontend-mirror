import React from 'react';

import { Flex } from '@atlaskit/primitives';

import Square from '../shared/block';

export default function Example() {
  return (
    <Flex gap="space.100" wrap="wrap">
      {[...Array(20).keys()].map(i => (
        <Square key={i} />
      ))}
    </Flex>
  );
}
