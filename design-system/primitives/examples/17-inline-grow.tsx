/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { Box, Inline, Stack } from '../src';

const growItems = ['hug', 'fill'] as const;

const truncateStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export default () => (
  <Stack testId="inline-example" space="100" alignInline="start">
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

    <Stack space="100">
      width=100% enables truncation
      <Box backgroundColor="neutral" customStyles={{ maxWidth: 200 }}>
        <Inline grow="fill">
          <Stack space="100" grow="fill">
            <span css={truncateStyles}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </span>
          </Stack>
        </Inline>
      </Box>
    </Stack>
  </Stack>
);
