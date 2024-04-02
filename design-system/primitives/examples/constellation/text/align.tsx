import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

export default () => {
  return (
    <Stack space="space.100">
      <Text align="start">Text alignment: start</Text>
      <Text align="center">Text alignment: center</Text>
      <Text align="end">Text alignment: end</Text>
    </Stack>
  );
};
