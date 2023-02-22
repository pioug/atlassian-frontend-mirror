/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack } from '../src';

const growItems = ['hug', 'fill'] as const;

export default () => (
  <Box testId="inline-example" padding="space.100" display="flex">
    <Stack space="100">
      {growItems.map(grow => (
        <Stack alignInline="center">
          {grow}
          <Box
            backgroundColor="neutral"
            customStyles={{
              width: '200px',
            }}
          >
            <Inline grow={grow}>
              <Stack space="100" grow={grow}>
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
                <Box
                  borderRadius="radius.200"
                  backgroundColor="discovery.bold"
                  padding="space.200"
                />
              </Stack>
            </Inline>
          </Box>
        </Stack>
      ))}
    </Stack>
  </Box>
);
