import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

export default () => {
  return (
    <Stack space="space.100">
      <Text>Text renders as a {'<span>'} tag by default</Text>
      <Text as="p">Text as p tag</Text>
      <Text as="strong">Text as strong tag</Text>
      <Text as="em">Text as em tag</Text>
    </Stack>
  );
};
