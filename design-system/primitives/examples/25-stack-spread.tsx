/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Stack } from '../src';

export default () => (
  <Box testId="stack-example" padding="space.100">
    <Stack alignInline="center">
      space-between
      <Box
        borderRadius="normal"
        padding="space.050"
        backgroundColor="neutral"
        UNSAFE_style={{ height: '200px' }}
      >
        <Stack space="200" spread="space-between">
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
  </Box>
);
