/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack } from '../src';

const growItems = ['hug', 'fill'] as const;

export default () => (
  <Box testId="stack-example" padding="space.100">
    <Inline space="100">
      {growItems.map(grow => (
        <Stack alignInline="center">
          {grow}
          <Box
            backgroundColor="neutral"
            borderRadius="normal"
            UNSAFE_style={{
              height: '200px',
            }}
          >
            <Stack grow={grow}>
              <Inline space="100" grow={grow}>
                <Box
                  borderRadius="normal"
                  backgroundColor="discovery.bold"
                  padding="space.200"
                />
                <Box
                  borderRadius="normal"
                  backgroundColor="discovery.bold"
                  padding="space.200"
                />
                <Box
                  borderRadius="normal"
                  backgroundColor="discovery.bold"
                  padding="space.200"
                />
              </Inline>
            </Stack>
          </Box>
        </Stack>
      ))}
    </Inline>
  </Box>
);
