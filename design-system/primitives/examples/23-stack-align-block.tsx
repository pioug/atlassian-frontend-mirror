/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack } from '../src';

const alignBlockItems = ['start', 'center', 'end'] as const;

export default () => (
  <Box testId="stack-example" padding="space.100">
    <Inline space="200">
      {alignBlockItems.map(alignBlock => (
        <Stack key={alignBlock} alignInline="center">
          {alignBlock}
          <Box
            backgroundColor="neutral"
            padding="space.050"
            borderRadius="normal"
            UNSAFE_style={{
              height: '200px',
            }}
          >
            <Stack space="050" alignBlock={alignBlock}>
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
      ))}
    </Inline>
  </Box>
);
