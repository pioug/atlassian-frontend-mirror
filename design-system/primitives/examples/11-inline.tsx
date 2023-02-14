/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

import { Box, Inline, Stack } from '../src';

const alignInlineItems = ['start', 'center', 'end'] as const;
const alignBlockItems = ['start', 'center', 'end', 'baseline'] as const;
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

const pageContainerStyles = css({ maxWidth: '900px' });
const spaceNameStyles = css({ minWidth: token('space.1000', '80px') });

export default () => (
  <Box padding="space.200">
    <div css={pageContainerStyles}>
      <Stack space="400">
        <Heading level="h700">Inline</Heading>

        <section>
          <Heading level="h500">Align Inline</Heading>
          {alignInlineItems.map(alignInline => (
            <Stack key={alignInline}>
              {alignInline}
              <Box
                display="block"
                borderRadius="normal"
                backgroundColor="neutral"
                padding="space.050"
                UNSAFE_style={{
                  width: '200px',
                }}
              >
                <Inline alignInline={alignInline} space="050">
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
                </Inline>
              </Box>
            </Stack>
          ))}
        </section>

        <section>
          <Heading level="h500">Spread</Heading>
          {spreadItems.map(spread => (
            <Stack key={spread}>
              {spread}
              <Box
                display="block"
                borderRadius="normal"
                backgroundColor="neutral"
                padding="space.050"
                UNSAFE_style={{
                  width: '200px',
                }}
              >
                <Inline spread={spread} space="050">
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
                </Inline>
              </Box>
            </Stack>
          ))}
        </section>
        <section>
          <Heading level="h500">Align Block</Heading>
          <Inline space="200">
            {alignBlockItems.map(alignBlock => (
              <Stack key={alignBlock} alignInline="center">
                {alignBlock}
                <Box
                  backgroundColor="neutral"
                  padding="space.050"
                  borderRadius="normal"
                  UNSAFE_style={{
                    height: '200px',
                  }}
                >
                  <Inline space="050" alignBlock={alignBlock}>
                    <Box
                      display="inline"
                      borderRadius="normal"
                      padding="space.300"
                      backgroundColor="discovery.bold"
                    ></Box>
                    <Box
                      display="inline"
                      borderRadius="normal"
                      padding="space.200"
                      backgroundColor="discovery.bold"
                    />
                    <Box
                      display="inline"
                      borderRadius="normal"
                      padding="space.200"
                      backgroundColor="discovery.bold"
                    />
                  </Inline>
                </Box>
              </Stack>
            ))}
          </Inline>
        </section>

        <section>
          <Heading level="h500">Space</Heading>
          <Stack space="050">
            {spaceItems.map(space => (
              <Inline key={space} alignBlock="center">
                <div css={spaceNameStyles}>{space}</div>
                <Box
                  borderRadius="normal"
                  padding="space.050"
                  backgroundColor="neutral"
                >
                  <Inline space={space}>
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
                  </Inline>
                </Box>
              </Inline>
            ))}
          </Stack>
        </section>

        <section>
          <Heading level="h500">shouldWrap</Heading>
          <Box
            borderRadius="normal"
            padding="space.050"
            backgroundColor="neutral"
          >
            <Inline space="200" shouldWrap={true}>
              {[...Array(25)].map((_, index) => (
                <Box
                  key={index}
                  borderRadius="normal"
                  padding="space.200"
                  backgroundColor="discovery.bold"
                />
              ))}
            </Inline>
          </Box>
        </section>

        <section>
          <Heading level="h500">Separator</Heading>
          <Box
            borderRadius="normal"
            padding="space.050"
            backgroundColor="neutral"
          >
            <Inline
              space="100"
              shouldWrap={true}
              alignBlock="center"
              separator="/"
            >
              {[...Array(20)].map((_, index) => (
                <Box
                  key={index}
                  borderRadius="normal"
                  padding="space.200"
                  backgroundColor="discovery.bold"
                />
              ))}
            </Inline>
          </Box>
        </section>
      </Stack>
    </div>
  </Box>
);
