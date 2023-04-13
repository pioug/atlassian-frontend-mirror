/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Stack, xcss } from '../src';

const containerStyles = xcss({ display: 'flex' });
const blockStyles = xcss({ borderRadius: 'radius.050' });

export default () => (
  <Box testId="stack-example" padding="space.100" xcss={containerStyles}>
    <Stack>
      <Box
        xcss={blockStyles}
        backgroundColor="discovery.bold"
        padding="space.200"
      />
      <Box
        xcss={blockStyles}
        backgroundColor="discovery.bold"
        padding="space.200"
      />
    </Stack>
  </Box>
);
