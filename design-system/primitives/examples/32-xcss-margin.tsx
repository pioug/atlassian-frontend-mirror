import React from 'react';

import { Box, Inline, Stack, xcss } from '../src';

const containerStyles = xcss({ display: 'flex', padding: 'space.200' });
const wrapperBoxStyles = xcss({
  backgroundColor: 'color.background.accent.gray.subtlest',
  borderColor: 'color.border.discovery',
  borderStyle: 'solid',
  borderWidth: 'border.width.outline',
});

const baseDisplayStyles = xcss({
  backgroundColor: 'color.background.accent.gray.subtle',
  height: 'size.500',
  width: 'size.500',
});
const logicalMarginStyles = xcss({
  marginBlockStart: 'space.100',
  marginBlockEnd: 'space.200',
  marginInlineStart: 'space.300',
  marginInlineEnd: 'space.400',
});
const visualMarginStyles = xcss({
  marginTop: 'space.100',
  marginBottom: 'space.200',
  marginLeft: 'space.300',
  marginRight: 'space.400',
});

export default function Basic() {
  return (
    <Box xcss={containerStyles}>
      <Stack alignInline="center" testId="xcss-margin" space="space.100">
        <strong>Usage of margin in xcss</strong>
        <Inline space="space.200">
          <Box xcss={wrapperBoxStyles}>
            <Box xcss={[baseDisplayStyles, logicalMarginStyles]} />
          </Box>
          <Box xcss={wrapperBoxStyles}>
            <Box xcss={[baseDisplayStyles, visualMarginStyles]} />
          </Box>
        </Inline>
      </Stack>
    </Box>
  );
}
