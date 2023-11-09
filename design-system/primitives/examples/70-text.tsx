/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Stack, Text } from '../src';

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
      <Text variant="body" as="strong">
        Text as strong tag
      </Text>
      <Text variant="body" as="em">
        Text as em tag
      </Text>
      <Text variant="body">Body is rendered as a {'<p>'} tag by default</Text>
      <Text variant="ui">
        UI text is rendered as a {'<span>'} tag by default
      </Text>
    </Stack>
  );
};
