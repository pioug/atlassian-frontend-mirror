/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Stack, xcss } from '../src';

const blockStyles = xcss({ borderRadius: 'border.radius.050' });
const flexStyles = xcss({ display: 'flex' });
const containerStyles = xcss({
  display: 'flex',
  borderRadius: 'border.radius.050',
});

export default () => (
  <Box testId="stack-example" padding="space.100" xcss={flexStyles}>
    <Stack alignInline="center">
      space-between
      <Box
        xcss={containerStyles}
        padding="space.050"
        backgroundColor="color.background.neutral"
        style={{ height: '200px' }}
      >
        <Stack space="space.200" spread="space-between">
          <Box
            xcss={blockStyles}
            padding="space.200"
            backgroundColor="color.background.discovery.bold"
          />
          <Box
            xcss={blockStyles}
            padding="space.200"
            backgroundColor="color.background.discovery.bold"
          />
          <Box
            xcss={blockStyles}
            padding="space.200"
            backgroundColor="color.background.discovery.bold"
          />
        </Stack>
      </Box>
    </Stack>
  </Box>
);
