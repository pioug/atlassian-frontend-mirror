/** @jsx jsx */
import { css, jsx } from '@emotion/react';

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
    <Stack space="100">
      {spaceItems.map(space => (
        <Inline>
          <span css={spaceValueStyles}>{space}</span>
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
        </Inline>
      ))}
    </Stack>
  </Box>
);
