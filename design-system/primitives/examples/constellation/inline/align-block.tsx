import React, { ReactNode } from 'react';

import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

const flexContainerStyles = xcss({
  display: 'flex',
  borderRadius: 'border.radius.050',
  height: 'size.600',
});

export default function Example() {
  return (
    <Inline spread="space-between">
      <Stack alignInline="center">
        "start" (default)
        <VisualContainer>
          <Inline space="space.050" alignBlock="start">
            <ExampleBox />
            <ExampleBox />
            <ExampleBox padding="space.300" />
          </Inline>
        </VisualContainer>
      </Stack>
      <Stack alignInline="center">
        "center"
        <VisualContainer>
          <Inline space="space.050" alignBlock="center">
            <ExampleBox />
            <ExampleBox />
            <ExampleBox padding="space.300" />
          </Inline>
        </VisualContainer>
      </Stack>
      <Stack alignInline="center">
        "end"
        <VisualContainer>
          <Inline space="space.050" alignBlock="end">
            <ExampleBox />
            <ExampleBox />
            <ExampleBox padding="space.300" />
          </Inline>
        </VisualContainer>
      </Stack>
      <Stack alignInline="center">
        "baseline"
        <VisualContainer>
          <Inline space="space.050" alignBlock="baseline">
            <ExampleBox />
            <ExampleBox />
            <ExampleBox padding="space.300" />
          </Inline>
        </VisualContainer>
      </Stack>
      <Stack alignInline="center">
        "stretch"
        <VisualContainer>
          <Inline space="space.050" alignBlock="stretch">
            <ExampleBox />
            <ExampleBox />
            <ExampleBox padding="space.300" />
          </Inline>
        </VisualContainer>
      </Stack>
    </Inline>
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
