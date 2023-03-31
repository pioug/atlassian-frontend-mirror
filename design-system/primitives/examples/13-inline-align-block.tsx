/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack } from '../src';

const alignBlockItems = ['start', 'center', 'end', 'baseline'] as const;

export default () => (
  <Box testId="inline-example" padding="space.100">
    <Inline space="200">
      {alignBlockItems.map(alignBlock => (
        <Stack key={alignBlock} alignInline="center">
          {alignBlock}
          <Box
            backgroundColor="neutral"
            padding="space.050"
            borderRadius="radius.200"
            style={{
              height: '200px',
            }}
            display="flex"
          >
            <Inline space="050" alignBlock={alignBlock}>
              <Box
                display="inline"
                borderRadius="radius.200"
                padding="space.300"
                backgroundColor="discovery.bold"
              ></Box>
              <Box
                display="inline"
                borderRadius="radius.200"
                padding="space.200"
                backgroundColor="discovery.bold"
              />
              <Box
                display="inline"
                borderRadius="radius.200"
                padding="space.200"
                backgroundColor="discovery.bold"
              />
            </Inline>
          </Box>
        </Stack>
      ))}
    </Inline>
  </Box>
);
