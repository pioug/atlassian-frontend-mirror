import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import Block from '../shared/block';

const containerStyles = xcss({
  display: 'flex',
});

export default function Example() {
  return (
    <Box testId="stack-example" padding="space.100">
      <Inline space="space.200" spread="space-between">
        <Stack alignInline="center" space="space.200">
          <Heading level="h400">Start alignment</Heading>
          <Box
            xcss={containerStyles}
            style={{
              height: '200px',
            }}
          >
            <Stack space="space.050" alignBlock="start">
              <Block />
              <Block />
              <Block />
            </Stack>
          </Box>
        </Stack>
        <Stack alignInline="center">
          <Heading level="h400">Center alignment</Heading>
          <Box
            xcss={containerStyles}
            style={{
              height: '200px',
            }}
          >
            <Stack space="space.050" alignBlock="center">
              <Block />
              <Block />
              <Block />
            </Stack>
          </Box>
        </Stack>
        <Stack alignInline="center">
          <Heading level="h400">End alignment</Heading>
          <Box
            xcss={containerStyles}
            style={{
              height: '200px',
            }}
          >
            <Stack space="space.050" alignBlock="end">
              <Block />
              <Block />
              <Block />
            </Stack>
          </Box>
        </Stack>
      </Inline>
    </Box>
  );
}
