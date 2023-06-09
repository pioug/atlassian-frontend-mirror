import React from 'react';

import Heading from '@atlaskit/heading';

import { Box, type BoxProps, Inline, Stack } from '../src';

const spacingValues: BoxProps['padding'][] = [
  'space.0',
  'space.025',
  'space.050',
  'space.075',
  'space.100',
  'space.150',
  'space.200',
  'space.250',
  'space.300',
  'space.400',
  'space.500',
  'space.600',
  'space.800',
  'space.1000',
];

/**
 * Box permutations
 */
export default () => {
  return (
    <Stack space="space.400" alignInline="start" testId="box-padding">
      <Stack space="space.200" testId="box-with-background-and-padding">
        <Heading level="h600">padding</Heading>
        <Inline space="space.200" alignBlock="center">
          {spacingValues.map(space => (
            <Box
              key={space}
              backgroundColor="color.background.discovery.bold"
              padding={space}
            >
              <Box backgroundColor="elevation.surface">{space}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="space.200" testId="box-with-background-and-paddingBlock">
        <Heading level="h600">paddingBlock</Heading>
        <Inline space="space.200" alignBlock="center">
          {spacingValues.map(space => (
            <Box
              key={space}
              backgroundColor="color.background.discovery.bold"
              paddingBlock={space}
            >
              <Box backgroundColor="elevation.surface">{space}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack
        space="space.200"
        testId="box-with-background-and-paddingBlockStart"
      >
        <Heading level="h600">paddingBlockStart</Heading>
        <Inline space="space.200" alignBlock="center">
          {spacingValues.map(space => (
            <Box
              key={space}
              backgroundColor="color.background.discovery.bold"
              paddingBlockStart={space}
            >
              <Box backgroundColor="elevation.surface">{space}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="space.200" testId="box-with-background-and-paddingBlockEnd">
        <Heading level="h600">paddingBlockEnd</Heading>
        <Inline space="space.200" alignBlock="center">
          {spacingValues.map(space => (
            <Box
              key={space}
              backgroundColor="color.background.discovery.bold"
              paddingBlockEnd={space}
            >
              <Box backgroundColor="elevation.surface">{space}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Inline space="space.600">
        <Stack space="space.200" testId="box-with-background-and-paddingInline">
          <Heading level="h600">paddingInline</Heading>
          <Stack space="space.200" alignInline="center">
            {spacingValues.map(space => (
              <Box
                key={space}
                backgroundColor="color.background.discovery.bold"
                paddingInline={space}
              >
                <Box backgroundColor="elevation.surface">{space}</Box>
              </Box>
            ))}
          </Stack>
        </Stack>

        <Stack
          space="space.200"
          testId="box-with-background-and-paddingInlineStart"
        >
          <Heading level="h600">paddingInlineStart</Heading>
          <Stack space="space.200" alignInline="center">
            {spacingValues.map(space => (
              <Box
                key={space}
                backgroundColor="color.background.discovery.bold"
                paddingInlineStart={space}
              >
                <Box backgroundColor="elevation.surface">{space}</Box>
              </Box>
            ))}
          </Stack>
        </Stack>

        <Stack
          space="space.200"
          testId="box-with-background-and-paddingInlineEnd"
        >
          <Heading level="h600">paddingInlineEnd</Heading>
          <Stack space="space.200" alignInline="center">
            {spacingValues.map(space => (
              <Box
                key={space}
                backgroundColor="color.background.discovery.bold"
                paddingInlineEnd={space}
              >
                <Box backgroundColor="elevation.surface">{space}</Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Inline>

      <Stack
        space="space.200"
        testId="box-with-background-and-overlapping-padding-props"
      >
        <Heading level="h600">overlapping padding props</Heading>
        <Box
          backgroundColor="color.background.discovery.bold"
          padding="space.100"
          paddingBlock="space.200"
          paddingInlineStart="space.300"
        >
          <Box backgroundColor="elevation.surface" padding="space.050">
            padding
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};
