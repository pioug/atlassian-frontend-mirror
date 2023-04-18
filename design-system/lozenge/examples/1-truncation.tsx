import React from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import Stack from '@atlaskit/primitives/stack';

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
