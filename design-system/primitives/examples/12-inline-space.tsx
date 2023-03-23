/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

import { Box, Inline, Stack } from '../src';

const spaceValueStyles = css({ minWidth: token('space.1000', '80px') });

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

export default () => (
  <Box testId="inline-example" padding="space.100">
    <Inline space="1000">
      <Stack space="100" testId="inline-space">
        <Heading level="h700">space</Heading>
        {spaceItems.map(space => (
          <Inline>
            <span css={spaceValueStyles}>{space}</span>
            <Inline space={space}>
              <Box
                borderRadius="radius.200"
                padding="space.200"
                backgroundColor="discovery.bold"
              />
              <Box
                borderRadius="radius.200"
                padding="space.200"
                backgroundColor="discovery.bold"
              />
            </Inline>
          </Inline>
        ))}
      </Stack>

      <Stack space="100" testId="inline-rowSpace">
        <Heading level="h700">rowSpace</Heading>
        {spaceItems.map(space => (
          <Box width="size.300">
            <Inline>
              <span css={spaceValueStyles}>{space}</span>
              <Inline rowSpace={space} shouldWrap>
                <Box
                  borderRadius="radius.200"
                  padding="space.200"
                  backgroundColor="discovery.bold"
                />
                <Box
                  borderRadius="radius.200"
                  padding="space.200"
                  backgroundColor="discovery.bold"
                />
              </Inline>
            </Inline>
          </Box>
        ))}
      </Stack>
    </Inline>
  </Box>
);
