/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { Box, Inline, Stack } from '../src';

const fixedSizeContainerStyles = css({ maxWidth: '300px' });

export default () => (
  <Box testId="inline-example" padding="space.100">
    <div css={fixedSizeContainerStyles}>
      <Stack space="200">
        <div>
          true
          <Box
            borderRadius="radius.200"
            padding="space.050"
            backgroundColor="neutral"
          >
            <Inline space="200" shouldWrap={true}>
              {[...Array(25)].map((_, index) => (
                <Box
                  key={index}
                  borderRadius="radius.200"
                  padding="space.200"
                  backgroundColor="discovery.bold"
                />
              ))}
            </Inline>
          </Box>
        </div>
        <div>
          false
          <Box
            borderRadius="radius.200"
            padding="space.050"
            backgroundColor="neutral"
          >
            <Inline space="200" shouldWrap={false}>
              {[...Array(25)].map((_, index) => (
                <Box
                  key={index}
                  borderRadius="radius.200"
                  padding="space.200"
                  backgroundColor="discovery.bold"
                />
              ))}
            </Inline>
          </Box>
        </div>
      </Stack>
    </div>
  </Box>
);
