/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack, xcss } from '../src';

const alignInlineItems = ['start', 'center', 'end'] as const;

const blockStyles = xcss({ borderRadius: 'radius.050' });

export default () => (
  <Box testId="inline-example" padding="space.100">
    <Inline space="space.100">
      {alignInlineItems.map(alignInline => (
        <Stack key={alignInline} alignInline="center">
          {alignInline}
          <Box
            xcss={blockStyles}
            backgroundColor="neutral"
            padding="space.050"
            style={{
              width: '200px',
            }}
          >
            <Inline alignInline={alignInline} space="space.050">
              <Box
                xcss={blockStyles}
                padding="space.200"
                backgroundColor="discovery.bold"
              />
              <Box
                xcss={blockStyles}
                padding="space.200"
                backgroundColor="discovery.bold"
              />
              <Box
                xcss={blockStyles}
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
