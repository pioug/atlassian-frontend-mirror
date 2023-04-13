/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack, xcss } from '../src';

const alignBlockItems = ['start', 'center', 'end', 'baseline'] as const;

const blockStyles = xcss({ borderRadius: 'radius.050' });
const containerStyles = xcss({
  display: 'flex',
  borderRadius: 'radius.050',
});

export default () => (
  <Box testId="inline-example" padding="space.100">
    <Inline space="200">
      {alignBlockItems.map(alignBlock => (
        <Stack key={alignBlock} alignInline="center">
          {alignBlock}
          <Box
            backgroundColor="neutral"
            padding="space.050"
            xcss={containerStyles}
            style={{
              height: '200px',
            }}
          >
            <Inline space="050" alignBlock={alignBlock}>
              <Box
                xcss={blockStyles}
                padding="space.300"
                backgroundColor="discovery.bold"
              ></Box>
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
