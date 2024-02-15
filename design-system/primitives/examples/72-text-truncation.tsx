import React from 'react';

import { Box, Inline, Stack, Text, xcss } from '../src';

const labelWidthStyles = xcss({
  width: '160px',
});

const truncationWidthStyles = xcss({
  width: '140px',
});

export default () => {
  return (
    <Stack space="space.100">
      <Inline space="space.100">
        <Box xcss={labelWidthStyles}>
          <Text>Body - no truncation:</Text>
        </Box>
        <Box xcss={truncationWidthStyles}>
          <Text variant="body">
            The quick brown fox jumped over the lazy dog
          </Text>
        </Box>
      </Inline>

      <Inline space="space.100">
        <Box xcss={labelWidthStyles}>
          <Text>Body - 1 line:</Text>
        </Box>
        <Box xcss={truncationWidthStyles}>
          <Text variant="body" maxLines={1}>
            The quick brown fox jumped over the lazy dog
          </Text>
        </Box>
      </Inline>

      <Inline space="space.100">
        <Box xcss={labelWidthStyles}>
          <Text>Body - 2 lines:</Text>
        </Box>
        <Box xcss={truncationWidthStyles}>
          <Text maxLines={2}>The quick brown fox jumped over the lazy dog</Text>
        </Box>
      </Inline>

      <Inline space="space.100">
        <Box xcss={labelWidthStyles}>
          <Text>Body - 3 lines:</Text>
        </Box>
        <Box xcss={truncationWidthStyles}>
          <Text maxLines={3}>The quick brown fox jumped over the lazy dog</Text>
        </Box>
      </Inline>

      <Inline space="space.100">
        <Box xcss={labelWidthStyles}>
          <Text>UI - cannot truncate:</Text>
        </Box>
        <Box xcss={truncationWidthStyles}>
          {/* @ts-expect-error The maxLines prop isn't available for UI text, and shouldn't apply clamp styles even if forced */}
          <Text variant="ui" maxLines={1}>
            The quick brown fox jumped over the lazy dog
          </Text>
        </Box>
      </Inline>
    </Stack>
  );
};
