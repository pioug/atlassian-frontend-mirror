import React from 'react';

import { Code } from '@atlaskit/code';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
  display: 'flex',
});

const boxStyles = xcss({
  padding: 'space.100',
  flexGrow: 1,
  backgroundColor: 'color.background.discovery',
});

export default function Example() {
  return (
    <Stack space="space.200">
      {(['hug', 'fill'] as const).map(growValue => (
        <Box xcss={containerStyles}>
          <Inline grow={growValue}>
            <Box xcss={boxStyles}>
              Wrapping <Code>Inline</Code> is set to{' '}
              <Code>grow="{growValue}"</Code>
            </Box>
          </Inline>
        </Box>
      ))}
    </Stack>
  );
}
