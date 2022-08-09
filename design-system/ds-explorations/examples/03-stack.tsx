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
 * Stack permutations
 */
export default () => {
  return (
    <Stack gap="sp-300">
      <Stack gap="sp-300" testId="stack-spacing">
        <Heading level="h700">Spacing</Heading>
        <Inline gap="sp-400">
          {Object.keys(SPACING_SCALE).map((space) => (
            <Stack gap="sp-300">
              <Heading level="h500">{space}</Heading>

              <Box backgroundColor={['neutral', 'grey']}>
                <Stack gap={space as GlobalSpacingToken} alignItems="center">
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
                </Stack>
              </Box>
            </Stack>
          ))}
        </Inline>
      </Stack>
      <Stack gap="sp-300" testId="stack-alignment">
        <Heading level="h700">Alignment</Heading>
        <Heading level="h600">alignItems</Heading>
        <Inline gap="sp-400">
          {flexAlignItems.map((alignItemsValue) => (
            <Stack gap="sp-300">
              <Heading level="h500">{alignItemsValue}</Heading>

              <Box backgroundColor={['neutral', 'grey']} display="block">
                <Stack gap="sp-200" alignItems={alignItemsValue as any}>
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
                </Stack>
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
                backgroundColor={['neutral', 'grey']}
                UNSAFE_style={{ height: '200px' }}
              >
                <Stack gap="sp-200" justifyContent={justifyContentValue as any}>
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
                </Stack>
              </Box>
            </Stack>
          ))}
        </Inline>
      </Stack>
    </Stack>
  );
};
