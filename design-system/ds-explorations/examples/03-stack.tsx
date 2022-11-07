import React from 'react';

import Heading from '@atlaskit/heading';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
} from '../src';
import { spacingScale } from '../src/internal/spacing-scale';

const flexAlignItems = ['center', 'baseline', 'flexStart', 'flexEnd'];
const flexJustifyContent = ['center', 'flexStart', 'flexEnd'];
const flexWrap = ['wrap'];

/**
 * Stack permutations
 */
export default () => {
  return (
    <Stack gap="scale.300">
      <Stack gap="scale.300" testId="stack-spacing">
        <Heading level="h700">Spacing</Heading>
        <Inline gap="scale.400">
          {spacingScale.map((space) => (
            <Stack key={space} gap="scale.300">
              <Heading level="h500">{space}</Heading>

              <Box backgroundColor="neutral">
                <Stack gap={space} alignItems="center">
                  <Box padding="scale.100" backgroundColor="success.bold" />
                  <Box padding="scale.100" backgroundColor="success.bold" />
                  <Box padding="scale.100" backgroundColor="success.bold" />
                </Stack>
              </Box>
            </Stack>
          ))}
        </Inline>
      </Stack>
      <Stack gap="scale.300" testId="stack-alignment">
        <Heading level="h700">Alignment</Heading>
        <Heading level="h600">alignItems</Heading>
        <Inline gap="scale.400">
          {flexAlignItems.map((alignItemsValue) => (
            <Stack key={alignItemsValue} gap="scale.300">
              <Heading level="h500">{alignItemsValue}</Heading>

              <Box backgroundColor="neutral" display="block">
                <Stack gap="scale.200" alignItems={alignItemsValue as any}>
                  <Box padding="scale.100" backgroundColor="success.bold" />
                  <Box padding="scale.100" backgroundColor="success.bold" />
                  <Box padding="scale.100" backgroundColor="success.bold" />
                </Stack>
              </Box>
            </Stack>
          ))}
        </Inline>

        <Heading level="h600">justifyContent</Heading>
        <Inline gap="scale.400">
          {flexJustifyContent.map((justifyContentValue) => (
            <Stack key={justifyContentValue} gap="scale.300">
              <Heading level="h500">{justifyContentValue}</Heading>

              <Box backgroundColor="neutral" UNSAFE_style={{ height: '200px' }}>
                <Stack
                  gap="scale.200"
                  justifyContent={justifyContentValue as any}
                >
                  <Box padding="scale.100" backgroundColor="success.bold" />
                  <Box padding="scale.100" backgroundColor="success.bold" />
                  <Box padding="scale.100" backgroundColor="success.bold" />
                </Stack>
              </Box>
            </Stack>
          ))}
        </Inline>

        <Heading level="h700">Overflow</Heading>
        <Heading level="h600">flexWrap</Heading>
        <Inline gap="scale.400">
          {flexWrap.map((flexWrapValue) => (
            <Stack key={flexWrapValue} gap="scale.300">
              <Heading level="h500">{flexWrapValue}</Heading>

              <Box backgroundColor="neutral" UNSAFE_style={{ height: '50px' }}>
                <Stack gap="scale.200" flexWrap={flexWrapValue as any}>
                  <Box padding="scale.100" backgroundColor="success.bold" />
                  <Box padding="scale.100" backgroundColor="success.bold" />
                  <Box padding="scale.100" backgroundColor="success.bold" />
                </Stack>
              </Box>
            </Stack>
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
};
