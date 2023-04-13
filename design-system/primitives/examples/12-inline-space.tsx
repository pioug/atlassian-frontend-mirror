/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

import { Box, Inline, Stack, xcss } from '../src';

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

const spaceValueStyles = css({ minWidth: token('space.1000', '80px') });
const blockStyles = xcss({ borderRadius: 'radius.050' });
const containerStyles = xcss({ width: 'size.300' });

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
                xcss={blockStyles}
                padding="space.200"
                backgroundColor="discovery.bold"
              />
              <Box
                xcss={blockStyles}
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
          <Box xcss={containerStyles}>
            <Inline>
              <span css={spaceValueStyles}>{space}</span>
              <Inline rowSpace={space} shouldWrap>
                <Box
                  xcss={blockStyles}
                  padding="space.200"
                  backgroundColor="discovery.bold"
                />
                <Box
                  xcss={blockStyles}
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
