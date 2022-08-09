import React from 'react';

import Heading from '@atlaskit/heading';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '../src';
import { GlobalSpacingToken, SPACING_SCALE } from '../src/constants';

/**
 * Box permutations
 */
export default () => {
  return (
    <Stack gap="sp-400" alignItems="flexStart">
      <Stack gap="sp-200" testId="box-with-background-and-paddingBlock">
        <Heading level="h600">paddingBlock</Heading>
        <Inline gap="sp-200" alignItems="center">
          {Object.keys(SPACING_SCALE).map((space) => (
            <Box
              key={space}
              backgroundColor={['discovery.bold', 'purple']}
              paddingBlock={space as GlobalSpacingToken}
            >
              <Box
                backgroundColor={['elevation.surface', 'white']}
                justifyContent="center"
              >
                <Text>{space}</Text>
              </Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack gap="sp-200" testId="box-with-background-and-paddingInline">
        <Heading level="h600">paddingInline</Heading>
        <Stack gap="sp-200" alignItems="center">
          {Object.keys(SPACING_SCALE).map((space) => (
            <Box
              key={space}
              backgroundColor={['discovery.bold', 'purple']}
              paddingInline={space as GlobalSpacingToken}
            >
              <Box
                backgroundColor={['elevation.surface', 'white']}
                justifyContent="center"
              >
                <Text>{space}</Text>
              </Box>
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack gap="sp-200" testId="box-with-background-and-padding">
        <Heading level="h600">padding</Heading>
        <Inline gap="sp-200" alignItems="center">
          {Object.keys(SPACING_SCALE).map((space) => (
            <Box
              key={space}
              backgroundColor={['discovery.bold', 'purple']}
              padding={space as GlobalSpacingToken}
            >
              <Box
                backgroundColor={['elevation.surface', 'white']}
                justifyContent="center"
              >
                <Text>{space}</Text>
              </Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack gap="sp-200" testId="box-with-backgroundColor">
        <Heading level="h600">backgroundColor</Heading>
        <Inline gap="sp-200" alignItems="center">
          {([
            'discovery.bold',
            'success.bold',
            'warning.bold',
            'danger.bold',
            'information.bold',
            'brand.bold',
          ] as const).map((bgColor) => (
            <Box
              key={bgColor}
              backgroundColor={[bgColor, 'purple']}
              padding={'sp-400'}
            >
              <Box justifyContent="center">
                <Text color={['inverse', 'white']}>{bgColor}</Text>
              </Box>
            </Box>
          ))}
        </Inline>
      </Stack>

      <Stack gap="sp-200" testId="box-with-borderColor">
        <Heading level="h600">borderColor</Heading>
        <Inline gap="sp-200" alignItems="center">
          {([
            'discovery',
            'success',
            'warning',
            'danger',
            'information',
            'brand',
          ] as const).map((borderColor) => (
            <Box
              key={borderColor}
              backgroundColor={['neutral', 'grey']}
              borderColor={[borderColor, 'purple']}
              borderStyle="solid"
              borderWidth="2px"
              padding={'sp-400'}
            >
              <Box justifyContent="center">
                <Text color={['color.text', 'black']}>{borderColor}</Text>
              </Box>
            </Box>
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
};
