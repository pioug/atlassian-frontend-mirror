import React from 'react';

import { Code } from '@atlaskit/code';

import { Inline, Stack } from '../../../src';

const CustomInline = (tag: any) => (
  <Inline space="space.200" key={tag} as={tag}>
    <div>
      <Code>Inline</Code> rendering as <Code>{tag}</Code>.
    </div>
  </Inline>
);

export default function Example() {
  return (
    <Inline spread="space-between" alignBlock="center">
      <Stack space="space.200">
        {(['div', 'span'] as const).map(CustomInline)}
      </Stack>
      <Stack space="space.200">
        {(['ul', 'ol'] as const).map(CustomInline)}
      </Stack>
    </Inline>
  );
}
