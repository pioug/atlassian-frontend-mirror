/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline } from '../src';

export default () => (
  <Box testId="inline-example" padding="space.100">
    <Inline>
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
    </Inline>
  </Box>
);
