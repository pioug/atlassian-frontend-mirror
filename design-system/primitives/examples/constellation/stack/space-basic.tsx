import React from 'react';

import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack } from '@atlaskit/primitives';

export default function Example() {
  return (
    <Inline space="space.500">
      <Stack>
        <Box>
          <Lozenge>To do</Lozenge>
        </Box>
        <Box>
          <Lozenge appearance="moved">Moved</Lozenge>
        </Box>
        <Box>
          <Lozenge appearance="success">Done</Lozenge>
        </Box>
      </Stack>
      <Stack space="space.200">
        <Box>
          <Lozenge>To do</Lozenge>
        </Box>
        <Box>
          <Lozenge appearance="moved">Moved</Lozenge>
        </Box>
        <Box>
          <Lozenge appearance="success">Done</Lozenge>
        </Box>
      </Stack>
    </Inline>
  );
}
