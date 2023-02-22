/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Stack } from '../src';

export default () => (
  <Box testId="stack-example" padding="space.100" display="flex">
    <Stack alignInline="center">
      space-between
      <Box
        display="flex"
        borderRadius="radius.200"
        padding="space.050"
        backgroundColor="neutral"
        customStyles={{ height: '200px' }}
      >
        <Stack space="200" spread="space-between">
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
        </Stack>
      </Box>
    </Stack>
  </Box>
);
