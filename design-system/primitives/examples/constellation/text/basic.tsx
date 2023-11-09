import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

const variants = [
  'ui.small',
  'ui',
  'body.small',
  'body',
  'body.large',
] as const;

export default () => {
  return (
    <Stack space="space.100">
      {variants.map(v => (
        <Text variant={v}>Text variant {v}</Text>
      ))}
    </Stack>
  );
};
