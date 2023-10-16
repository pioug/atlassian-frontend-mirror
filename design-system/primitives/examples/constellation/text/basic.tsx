import React from 'react';

import { Stack } from '@atlaskit/primitives';

import Text from '../../../src/components/text';

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
