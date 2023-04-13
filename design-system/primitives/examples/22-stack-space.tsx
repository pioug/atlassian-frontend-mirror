/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack, xcss } from '../src';

const blockStyles = xcss({ borderRadius: 'radius.050' });
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
  <Box testId="stack-example" padding="space.100">
    <Inline space="100">
      {spaceItems.map(space => (
        <Stack alignInline="center">
          {space}
          <Stack space={space}>
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
          </Stack>
        </Stack>
      ))}
    </Inline>
  </Box>
);
