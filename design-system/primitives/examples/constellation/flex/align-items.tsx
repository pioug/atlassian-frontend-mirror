import React, { type ReactNode } from 'react';

import { Box, Flex, Stack, xcss } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

const flexContainerStyles = xcss({
  display: 'flex',
  borderRadius: 'border.radius',
  height: 'size.600',
});

export default function Example() {
  return (
    <Flex justifyContent="space-between" wrap="wrap">
      <Stack alignInline="center">
        "start" (default)
        <VisualContainer>
          <Flex gap="space.050" alignItems="start">
            <ExampleBox />
            <ExampleBox />
            <ExampleBox padding="space.300" />
          </Flex>
        </VisualContainer>
      </Stack>
      <Stack alignInline="center">
        "center"
        <VisualContainer>
          <Flex gap="space.050" alignItems="center">
            <ExampleBox />
            <ExampleBox />
            <ExampleBox padding="space.300" />
          </Flex>
        </VisualContainer>
      </Stack>
      <Stack alignInline="center">
        "end"
        <VisualContainer>
          <Flex gap="space.050" alignItems="end">
            <ExampleBox />
            <ExampleBox />
            <ExampleBox padding="space.300" />
          </Flex>
        </VisualContainer>
      </Stack>
      <Stack alignInline="center">
        "baseline"
        <VisualContainer>
          <Flex gap="space.050" alignItems="baseline">
            <ExampleBox />
            <ExampleBox />
            <ExampleBox padding="space.300" />
          </Flex>
        </VisualContainer>
      </Stack>
    </Flex>
  );
}

const VisualContainer = ({ children }: { children: ReactNode }) => (
  <Box
    backgroundColor="color.background.neutral"
    padding="space.050"
    xcss={flexContainerStyles}
  >
    {children}
  </Box>
);
