import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

export default () => {
  return (
    <Stack space="space.100">
      <Text weight="regular">Text regular font weight</Text>
      <Text weight="medium">Text medium font weight</Text>
      <Text weight="semibold">Text semibold font weight</Text>
      <Text weight="bold">Text bold font weight</Text>
    </Stack>
  );
};
