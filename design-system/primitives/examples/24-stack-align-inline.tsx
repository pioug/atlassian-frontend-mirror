/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack } from '../src';

const alignInlineItems = ['start', 'center', 'end'] as const;

export default () => (
  <Box testId="stack-example" padding="space.100">
    <Inline space="100">
      {alignInlineItems.map(alignInline => (
        <Stack key={alignInline} alignInline="center">
          {alignInline}
          <Box
            display="block"
            borderRadius="normal"
            backgroundColor="neutral"
            padding="space.050"
            UNSAFE_style={{
              width: '200px',
            }}
          >
            <Stack alignInline={alignInline} space="050">
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
