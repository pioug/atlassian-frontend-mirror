import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

export default () => {
  return (
    <Stack space="space.100">
      <Stack space="space.0">
        <Text align="start" as="p">Text alignment:</Text>
        <Text align="start" as="p">Start</Text>
      </Stack>
      <Stack space="space.0">
        <Text align="center" as="p">Text alignment:</Text>
        <Text align="center" as="p">Center</Text>
      </Stack>
      <Stack space="space.0">
        <Text align="end" as="p">Text alignment:</Text>
        <Text align="end" as="p">End</Text>
      </Stack>
    </Stack>
  );
};
