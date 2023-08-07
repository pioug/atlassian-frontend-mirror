import React from 'react';

import { Code } from '@atlaskit/code';
import { Inline, Stack } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

export default function Example() {
  return (
    <Stack alignInline="start" space="space.100">
      <Inline grow="hug">
        <ExampleBox style={{ display: 'block', flexGrow: 1 }}>
          Wrapping <Code>Inline</Code> is set to <Code>grow="hug"</Code>
        </ExampleBox>
      </Inline>
      <Inline grow="fill">
        <ExampleBox style={{ display: 'block', flexGrow: 1 }}>
          Wrapping <Code>Inline</Code> is set to <Code>grow="fill"</Code>
        </ExampleBox>
      </Inline>
    </Stack>
  );
}
