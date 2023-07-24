import React from 'react';

import { Inline, Stack } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Example() {
  return (
    <Inline space="space.200">
      <Stack space="space.100" grow="hug">
        <Block>This content is hugged</Block>
      </Stack>
      <Stack space="space.100" grow="fill">
        <Block>Available space is filled</Block>
      </Stack>
    </Inline>
  );
}
