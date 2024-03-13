import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

const sizes = ['small', 'medium', 'large'] as const;

export default () => {
  return (
    <Stack space="space.100">
      {sizes.map(v => (
        <Text size={v}>Text size: {v}</Text>
      ))}
    </Stack>
  );
};
