/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack, xcss } from '../src';

const containerStyles = xcss({ display: 'flex' });
const blockStyles = xcss({ borderRadius: 'radius.050' });

export default () => (
  <Box testId="inline-example" padding="space.100" xcss={containerStyles}>
    <Stack alignInline="center">
      space-between
      <Box
        xcss={blockStyles}
        padding="space.050"
        backgroundColor="neutral"
        style={{
          width: '200px',
        }}
      >
        <Inline space="200" spread="space-between">
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
          <Box
            xcss={blockStyles}
            padding="space.200"
            backgroundColor="discovery.bold"
          />
        </Inline>
      </Box>
    </Stack>
  </Box>
);
