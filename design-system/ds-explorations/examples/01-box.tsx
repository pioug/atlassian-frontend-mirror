import React from 'react';

import Heading from '@atlaskit/heading';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '../src';
import { spacingScale } from '../src/internal/spacing-scale';

/**
 * Box permutations
 */
export default () => {
  return (
    <Stack gap="space.400" alignItems="flexStart">
      <Stack gap="space.200" testId="box-with-background-and-paddingBlock">
        <Heading level="h600">paddingBlock</Heading>
        <Inline gap="space.200" alignItems="center">
          {spacingScale.map((space) => (
            <Box
              key={space}
              backgroundColor="discovery.bold"
              paddingBlock={space}
            >
              <Box backgroundColor="elevation.surface" justifyContent="center">
                <Text>{space}</Text>
              </Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack gap="space.200" testId="box-with-background-and-paddingInline">
        <Heading level="h600">paddingInline</Heading>
        <Stack gap="space.200" alignItems="center">
          {spacingScale.map((space) => (
            <Box
              key={space}
              backgroundColor="discovery.bold"
              paddingInline={space}
            >
              <Box backgroundColor="elevation.surface" justifyContent="center">
                <Text>{space}</Text>
              </Box>
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack gap="space.200" testId="box-with-background-and-padding">
        <Heading level="h600">padding</Heading>
        <Inline gap="space.200" alignItems="center">
          {spacingScale.map((space) => (
            <Box key={space} backgroundColor="discovery.bold" padding={space}>
              <Box backgroundColor="elevation.surface" justifyContent="center">
                <Text>{space}</Text>
              </Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack gap="space.200" testId="box-with-backgroundColor">
        <Heading level="h600">backgroundColor</Heading>
        <Inline gap="space.200" alignItems="center">
          {(
            [
              'discovery.bold',
              'success.bold',
              'warning.bold',
              'danger.bold',
              'information.bold',
              'brand.bold',
            ] as const
          ).map((bgColor) => (
            <Box key={bgColor} backgroundColor={bgColor} padding="space.400">
              <Box justifyContent="center">
                <Text>{bgColor}</Text>
              </Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack gap="space.200" testId="box-with-borderColor">
        <Heading level="h600">borderColor</Heading>
        <Inline gap="space.200" alignItems="center">
          {(
            [
              'discovery',
              'success',
              'warning',
              'danger',
              'information',
              'brand',
            ] as const
          ).map((borderColor) => (
            <Box
              key={borderColor}
              backgroundColor="neutral"
              borderColor={borderColor}
              borderStyle="solid"
              borderWidth="2px"
              padding="space.400"
            >
              <Box justifyContent="center">
                <Text color="color.text">{borderColor}</Text>
              </Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack gap="space.200" testId="box-with-shadow">
        <Heading level="h600">shadow</Heading>
        <Inline gap="space.200" alignItems="center">
          {(['raised', 'overflow', 'overlay'] as const).map((shadow) => (
            <Box
              key={shadow}
              backgroundColor="elevation.surface"
              shadow={shadow}
              padding="space.400"
            >
              <Box justifyContent="center">
                <Text color="color.text">{shadow}</Text>
              </Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack gap="space.200" testId="box-with-layer">
        <Heading level="h600">layer</Heading>
        <Box alignItems="center" UNSAFE_style={{ width: 800, height: 650 }}>
          {(
            [
              'card',
              'navigation',
              'dialog',
              'layer',
              'blanket',
              'modal',
              'flag',
              'spotlight',
              'tooltip',
            ] as const
          ).map((layer, index) => (
            <Box
              key={layer}
              backgroundColor="elevation.surface"
              layer={layer}
              shadow="overlay"
              padding="space.400"
              position="absolute"
              UNSAFE_style={{
                top: index * 64,
                left: index * 64,
              }}
            >
              <Box justifyContent="center">
                <Text color="color.text">{layer}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Stack>
    </Stack>
  );
};
