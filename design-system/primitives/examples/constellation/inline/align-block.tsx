import React from 'react';

import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import Square from '../shared/square';

const flexContainerStyles = xcss({
  display: 'flex',
  borderRadius: 'radius.050',
  height: 'size.600',
});

export default function Example() {
  return (
    <Box padding="space.100">
      <Inline space="space.200" spread="space-between">
        <Stack alignInline="center">
          Start alignment
          <Box
            backgroundColor="neutral"
            padding="space.050"
            xcss={flexContainerStyles}
          >
            <Inline space="space.050" alignBlock="start">
              <Square />
              <Square />
              <Square padding="space.300" />
            </Inline>
          </Box>
        </Stack>
        <Stack alignInline="center">
          Center alignment
          <Box
            backgroundColor="neutral"
            padding="space.050"
            xcss={flexContainerStyles}
          >
            <Inline space="space.050" alignBlock="center">
              <Square />
              <Square />
              <Square padding="space.300" />
            </Inline>
          </Box>
        </Stack>
        <Stack alignInline="center">
          End alignment
          <Box
            backgroundColor="neutral"
            padding="space.050"
            xcss={flexContainerStyles}
          >
            <Inline space="space.050" alignBlock="end">
              <Square />
              <Square />
              <Square padding="space.300" />
            </Inline>
          </Box>
        </Stack>
        <Stack alignInline="center">
          Baseline alignment
          <Box
            backgroundColor="neutral"
            padding="space.050"
            xcss={flexContainerStyles}
          >
            <Inline space="space.050" alignBlock="baseline">
              <Square />
              <Square />
              <Square padding="space.300" />
            </Inline>
          </Box>
        </Stack>
      </Inline>
    </Box>
  );
}
