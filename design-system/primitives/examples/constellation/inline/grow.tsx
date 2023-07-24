import React from 'react';

import { Code } from '@atlaskit/code';
import { Inline, Stack } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Example() {
  return (
    <Stack alignInline="start" space="space.100">
      <Inline grow="hug">
        <Block style={{ flexGrow: 1 }}>
          Wrapping <Code>Inline</Code> is set to <Code>grow="hug"</Code>
        </Block>
      </Inline>
      <Inline grow="fill">
        <Block style={{ flexGrow: 1 }}>
          Wrapping <Code>Inline</Code> is set to <Code>grow="fill"</Code>
        </Block>
      </Inline>
    </Stack>
  );
}
