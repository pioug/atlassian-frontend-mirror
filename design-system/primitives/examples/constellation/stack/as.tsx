import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives';

export default function Example() {
  return (
    <Inline spread="space-between">
      <Stack space="space.150">
        <Heading level="h500">Stack as 'div'</Heading>
        <Stack space="space.200">
          <Box>First child</Box>
          <Box>Second child</Box>
          <Box>Third child</Box>
          <Box>Fourth child</Box>
        </Stack>
      </Stack>
      <Stack space="space.150">
        <Heading level="h500">Stack as 'span'</Heading>
        <Stack as="span" space="space.200">
          <Box>First child</Box>
          <Box>Second child</Box>
          <Box>Third child</Box>
          <Box>Fourth child</Box>
        </Stack>
      </Stack>
      <Box>
        <Heading level="h500">Stack as 'ul'</Heading>
        <Stack as="ul" space="space.200">
          <li>Unordered List Item</li>
          <li>Unordered List Item</li>
          <li>Unordered List Item</li>
          <li>Unordered List Item</li>
        </Stack>
      </Box>
      <Box>
        <Heading level="h500">Stack as 'ol'</Heading>
        <Stack as="ol" space="space.200">
          <li>Ordered List Item</li>
          <li>Ordered List Item</li>
          <li>Ordered List Item</li>
          <li>Ordered List Item</li>
        </Stack>
      </Box>
    </Inline>
  );
}
