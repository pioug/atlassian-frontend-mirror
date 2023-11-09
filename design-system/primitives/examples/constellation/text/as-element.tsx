import React from 'react';

import { Stack, Text } from '@atlaskit/primitives';

export default () => {
  return (
    <Stack space="space.100">
      <Text variant="body">Body is rendered as a {'<p>'} tag by default</Text>
      <Text variant="ui">
        UI text is rendered as a {'<span>'} tag by default
      </Text>
      <Text variant="body" as="strong">
        Text as strong tag
      </Text>
      <Text variant="body" as="em">
        Text as em tag
      </Text>
    </Stack>
  );
};
