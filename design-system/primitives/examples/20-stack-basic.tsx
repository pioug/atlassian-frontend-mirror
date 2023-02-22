/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Stack } from '../src';

export default () => (
  <Box testId="stack-example" padding="space.100" display="flex">
    <Stack>
      <Box
        borderRadius="radius.200"
        backgroundColor="discovery.bold"
        padding="space.200"
      />
      <Box
        borderRadius="radius.200"
        backgroundColor="discovery.bold"
        padding="space.200"
      />
    </Stack>
  </Box>
);
