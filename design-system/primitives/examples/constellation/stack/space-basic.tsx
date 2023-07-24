import React from 'react';

import { Inline, Stack } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Example() {
  return (
    <Inline space="space.500">
      {(['space.100', 'space.200'] as const).map(space => (
        <Stack key={space} space={space}>
          <Block />
          <Block />
          <Block />
        </Stack>
      ))}
    </Inline>
  );
}
