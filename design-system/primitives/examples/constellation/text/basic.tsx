import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

export default () => {
  return (
    <Stack space="space.100">
      <Text size="small">Text size: small</Text>
      <Text>Text size: medium (default)</Text>
      <Text size="large">Text size: large</Text>
    </Stack>
  );
};
