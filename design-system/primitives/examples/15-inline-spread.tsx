/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack } from '../src';

export default () => (
  <Box testId="inline-example" padding="space.100" display="flex">
    <Stack alignInline="center">
      space-between
      <Box
        borderRadius="radius.200"
        display="block"
        padding="space.050"
        backgroundColor="neutral"
        style={{
          width: '200px',
        }}
      >
        <Inline space="200" spread="space-between">
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
          <Box
            borderRadius="radius.200"
            padding="space.200"
            backgroundColor="discovery.bold"
          />
        </Inline>
      </Box>
    </Stack>
  </Box>
);
