import React from 'react';

import {
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import Lozenge from '../src';

export default () => (
  <Stack gap="scale.100">
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
