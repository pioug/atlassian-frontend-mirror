import React from 'react';

import Heading from '@atlaskit/heading';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
} from '../src';
import { GlobalSpacingToken, SPACING_SCALE } from '../src/constants';

const flexAlignItems = ['center', 'baseline', 'flexStart', 'flexEnd'];
const flexJustifyContent = ['center', 'flexStart', 'flexEnd'];

/**
 * Inline permutations
 */
export default () => {
  return (
    <Stack gap="sp-300">
      <Stack gap="sp-300" testId="inline-spacing">
        <Heading level="h700">Spacing</Heading>
        <Stack gap="sp-400">
          {Object.keys(SPACING_SCALE).map((space) => (
            <Inline gap="sp-300">
              <Box width="sp-800">
                <Heading level="h500">{space}</Heading>
              </Box>

              <Box backgroundColor={['neutral', 'grey']}>
                <Inline gap={space as GlobalSpacingToken} alignItems="center">
                  <Box
                    padding="sp-100"
                    backgroundColor={['success.bold', 'green']}
                  >
                    {' '}
                  </Box>
                  <Box
                    padding="sp-100"
                    backgroundColor={['success.bold', 'green']}
                  >
                    {' '}
                  </Box>
                  <Box
                    padding="sp-100"
                    backgroundColor={['success.bold', 'green']}
                  >
                    {' '}
                  </Box>
                </Inline>
              </Box>
            </Inline>
          ))}
        </Stack>
      </Stack>
      <Stack gap="sp-300" testId="inline-alignment">
        <Heading level="h700">Alignment</Heading>
        <Heading level="h600">alignItems</Heading>
        <Inline gap="sp-400">
          {flexAlignItems.map((alignItemsValue) => (
            <Stack gap="sp-300">
              <Heading level="h500">{alignItemsValue}</Heading>

              <Box
                backgroundColor={['neutral', 'grey']}
                UNSAFE_style={{ height: '100px' }}
              >
                <Inline gap="sp-200" alignItems={alignItemsValue as any}>
                  <Box
                    padding="sp-100"
                    backgroundColor={['success.bold', 'green']}
                  >
                    {' '}
                  </Box>
                  <Box
                    padding="sp-100"
                    backgroundColor={['success.bold', 'green']}
                  >
                    {' '}
                  </Box>
                  <Box
                    padding="sp-100"
                    backgroundColor={['success.bold', 'green']}
                  >
                    {' '}
                  </Box>
                </Inline>
              </Box>
            </Stack>
          ))}
        </Inline>

        <Heading level="h600">justifyContent</Heading>
        <Inline gap="sp-400">
          {flexJustifyContent.map((justifyContentValue) => (
            <Stack gap="sp-300">
              <Heading level="h500">{justifyContentValue}</Heading>

              <Box
                display="block"
                backgroundColor={['neutral', 'grey']}
                UNSAFE_style={{ width: '140px' }}
              >
                <Inline
                  gap="sp-200"
                  justifyContent={justifyContentValue as any}
                >
                  <Box
                    padding="sp-100"
                    backgroundColor={['success.bold', 'green']}
                  >
                    {' '}
                  </Box>
                  <Box
                    padding="sp-100"
                    backgroundColor={['success.bold', 'green']}
                  >
                    {' '}
                  </Box>
                  <Box
                    padding="sp-100"
                    backgroundColor={['success.bold', 'green']}
                  >
                    {' '}
                  </Box>
                </Inline>
              </Box>
            </Stack>
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
};
