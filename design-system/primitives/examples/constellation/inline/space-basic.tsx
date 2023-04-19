import React from 'react';

import Badge from '@atlaskit/badge';
import Lozenge from '@atlaskit/lozenge';

import { Inline, Stack } from '../../../src';

export default function Example() {
  return (
    <Stack space="space.500">
      {(['space.100', 'space.200'] as const).map(space => (
        <Inline key={space} space={space}>
          <Lozenge isBold>To do</Lozenge>
          <Badge appearance="primary">{5}</Badge>
          <Lozenge appearance="moved" isBold>
            Moved
          </Lozenge>
          <Badge appearance="important">{25}</Badge>
          <Lozenge appearance="success" isBold>
            Done
          </Lozenge>
        </Inline>
      ))}
    </Stack>
  );
}
