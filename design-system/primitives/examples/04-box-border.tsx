import React from 'react';

import Heading from '@atlaskit/heading';

import { Box, Inline, Stack } from '../src';

const borderColors = [
  'discovery',
  'success',
  'warning',
  'danger',
  'information',
  'brand',
] as const;

const borderStyles = ['none', 'solid'] as const;
const borderWidths = ['size.050', 'size.100'] as const;
const borderRadii = [
  'radius.100',
  'radius.200',
  'radius.300',
  'radius.400',
  'radius.round',
] as const;

/**
 * Box permutations
 */
export default () => {
  return (
    <Stack space="400" alignInline="start">
      <Stack space="200" testId="box-with-borderWidth">
        <Heading level="h600">borderWidth</Heading>
        <Inline space="200" alignBlock="center">
          {borderWidths.map(borderWidth => (
            <Box
              key={borderWidth}
              backgroundColor="neutral"
              borderWidth={borderWidth}
              borderStyle="solid"
              borderColor="danger"
              padding="space.400"
            >
              <Box>{borderWidth}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="200" testId="box-with-borderStyle">
        <Heading level="h600">borderStyle</Heading>
        <Inline space="200" alignBlock="center">
          {borderStyles.map(borderStyle => (
            <Box
              key={borderStyle}
              backgroundColor="neutral"
              borderStyle={borderStyle}
              padding="space.400"
            >
              <Box>{borderStyle}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="200" testId="box-with-borderColor">
        <Heading level="h600">borderColor</Heading>
        <Inline space="200" alignBlock="center">
          {borderColors.map(borderColor => (
            <Box
              key={borderColor}
              backgroundColor="neutral"
              borderColor={borderColor}
              padding="space.400"
              borderStyle="solid"
            >
              <Box>{borderColor}</Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack space="200" testId="box-with-borderColor">
        <Heading level="h600">borderRadius</Heading>
        <Inline space="200" alignBlock="center">
          {borderRadii.map(borderRadius => (
            <Box
              key={borderRadius}
              backgroundColor="neutral"
              borderRadius={borderRadius}
              padding="space.400"
              borderStyle="solid"
              height="size.600"
              width="size.600"
            >
              {borderRadius}
            </Box>
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
};
