/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Stack } from '../src';
import Text from '../src/components/text';

const variants = ['ui.sm', 'ui', 'body.sm', 'body', 'body.lg'] as const;

export default () => {
  return (
    <Stack space="space.100">
      {variants.map(v => (
        <Text variant={v}>Text variant {v}</Text>
      ))}
    </Stack>
  );
};
