/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack, xcss } from '../src';

const growItems = ['hug', 'fill'] as const;

const containerStyles = xcss({
  display: 'flex',
  borderRadius: 'radius.050',
});

const blockStyles = xcss({ borderRadius: 'radius.050' });

export default () => (
  <Box testId="stack-example" padding="space.100">
    <Inline space="space.100">
      {growItems.map(grow => (
        <Stack alignInline="center">
          {grow}
          <Box
            xcss={containerStyles}
            backgroundColor="neutral"
            style={{
              height: '200px',
            }}
          >
            <Stack grow={grow}>
              <Inline space="space.100" grow={grow}>
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
                <Box
                  xcss={blockStyles}
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
