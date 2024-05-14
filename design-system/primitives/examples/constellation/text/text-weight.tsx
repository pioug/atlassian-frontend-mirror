import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

export default () => {
  return (
    <Stack space="space.100">
      <Text>Text weight: regular (default)</Text>
      <Text weight="medium">Text weight: medium</Text>
      <Text weight="semibold">Text weight: semibold</Text>
      <Text weight="bold">Text weight: bold</Text>
    </Stack>
  );
};
