import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

import Lozenge from '../src';

export default () => (
  <Stack space="space.100">
    <Text>
      <Lozenge appearance="success">
        very very very wide text which truncates
      </Lozenge>
    </Text>
    <Text>
      <Lozenge appearance="success" isBold>
        very very very wide text which truncates
      </Lozenge>
    </Text>
  </Stack>
);
