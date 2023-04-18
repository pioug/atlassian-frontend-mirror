/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, Inline, Stack, xcss } from '../src';

const alignInlineItems = ['start', 'center', 'end'] as const;

const borderRadiusStyles = xcss({ borderRadius: 'radius.050' });

export default () => (
  <Box testId="stack-example" padding="space.100">
    <Inline space="space.100">
      {alignInlineItems.map(alignInline => (
        <Stack key={alignInline} alignInline="center">
          {alignInline}
          <Box
            xcss={borderRadiusStyles}
            backgroundColor="neutral"
            padding="space.050"
            style={{
              width: '200px',
            }}
          >
            <Stack alignInline={alignInline} space="space.050">
              <Box
                xcss={borderRadiusStyles}
                padding="space.200"
                backgroundColor="discovery.bold"
              />
              <Box
                xcss={borderRadiusStyles}
                padding="space.200"
                backgroundColor="discovery.bold"
              />
              <Box
                xcss={borderRadiusStyles}
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
