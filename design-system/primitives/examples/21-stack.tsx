/** @jsx jsx */
import { jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';

import { Box, Inline, Stack } from '../src';

const alignInlineItems = ['start', 'center', 'end'] as const;
const alignBlockItems = ['start', 'center', 'end'] as const;
const spreadItems = ['space-between'] as const;
const spaceItems = [
  '0',
  '025',
  '050',
  '075',
  '100',
  '150',
  '200',
  '250',
  '300',
  '400',
  '500',
  '600',
  '800',
  '1000',
] as const;

/**
 * Stack permutations
 */
export default () => (
  <Box padding="space.200">
    <Stack space="400">
      <Stack space="300" alignInline="start">
        <Heading level="h700">Stack</Heading>
        <section>
          <Stack space="100">
            <Heading level="h500">Align Block</Heading>
            <Inline spread="space-between" space="400">
              {alignBlockItems.map(alignBlock => (
                <Stack key={alignBlock} space="050" alignInline="center">
                  {alignBlock}

                  <Box
                    borderRadius="normal"
                    padding="space.050"
                    backgroundColor="neutral"
                    UNSAFE_style={{
                      height: '200px',
                    }}
                  >
                    <Stack space="050" alignBlock={alignBlock}>
                      <Box
                        borderRadius="normal"
                        padding="space.200"
                        backgroundColor="discovery.bold"
                      />
                      <Box
                        borderRadius="normal"
                        padding="space.200"
                        backgroundColor="discovery.bold"
                      />
                      <Box
                        borderRadius="normal"
                        padding="space.200"
                        backgroundColor="discovery.bold"
                      />
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Inline>
          </Stack>
        </section>

        <section>
          <Stack space="100">
            <Heading level="h500">Spread</Heading>
            <Inline spread="space-between" space="400">
              {spreadItems.map(spread => (
                <Stack key={spread} space="050" alignInline="start">
                  {spread}

                  <Box
                    borderRadius="normal"
                    padding="space.050"
                    backgroundColor="neutral"
                    UNSAFE_style={{
                      height: '200px',
                    }}
                  >
                    <Stack space="050" spread={spread}>
                      <Box
                        borderRadius="normal"
                        padding="space.200"
                        backgroundColor="discovery.bold"
                      />
                      <Box
                        borderRadius="normal"
                        padding="space.200"
                        backgroundColor="discovery.bold"
                      />
                      <Box
                        borderRadius="normal"
                        padding="space.200"
                        backgroundColor="discovery.bold"
                      />
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Inline>
          </Stack>
        </section>

        <section>
          <Heading level="h500">Align Inline</Heading>
          <Inline space="100">
            {alignInlineItems.map(alignInline => (
              <Stack key={alignInline} alignInline="center">
                {alignInline}
                <Box
                  borderRadius="normal"
                  padding="space.050"
                  backgroundColor="neutral"
                  UNSAFE_style={{
                    width: '200px',
                  }}
                >
                  <Stack grow="fill" alignInline={alignInline} space="050">
                    <Box
                      borderRadius="normal"
                      padding="space.200"
                      backgroundColor="discovery.bold"
                    />
                    <Box
                      borderRadius="normal"
                      padding="space.200"
                      backgroundColor="discovery.bold"
                    />
                    <Box
                      borderRadius="normal"
                      padding="space.200"
                      backgroundColor="discovery.bold"
                    />
                  </Stack>
                </Box>
              </Stack>
            ))}
          </Inline>
        </section>

        <section>
          <Stack space="100">
            <Heading level="h500">Space</Heading>
            <Inline space="200" spread="space-between">
              {spaceItems.map(space => (
                <Stack key={space} space="100" alignInline="center">
                  {space}
                  <Box
                    borderRadius="normal"
                    padding="space.050"
                    backgroundColor="neutral"
                  >
                    <Stack space={space}>
                      <Box
                        borderRadius="normal"
                        padding="space.200"
                        backgroundColor="discovery.bold"
                      />
                      <Box
                        borderRadius="normal"
                        padding="space.200"
                        backgroundColor="discovery.bold"
                      />
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Inline>
          </Stack>
        </section>
      </Stack>
    </Stack>
  </Box>
);
