import React from 'react';

import { Box, Inline, Stack, xcss } from '../src';

const aboveStyles = xcss({
  '@media all': {
    ':after': {
      content: '"all"',
    },
  },
  '@media (min-width: 30rem)': {
    ':after': {
      content: '"(min-width: 30rem)"',
    },
  },
  '@media (min-width: 48rem)': {
    ':after': {
      content: '"(min-width: 48rem)"',
    },
  },
  '@media (min-width: 64rem)': {
    ':after': {
      content: '"(min-width: 64rem)"',
    },
  },
  '@media (min-width: 90rem)': {
    ':after': {
      content: '"(min-width: 90rem)"',
    },
  },
  '@media (min-width: 110rem)': {
    ':after': {
      content: '"(min-width: 110rem)"',
    },
  },
});

export default function Basic() {
  return (
    <Box testId="media-query-example" padding="space.200">
      <Stack space="space.200">
        <Inline alignBlock="center">
          <Box as="span">Above:</Box>
          <Box testId="box-above-mq" padding="space.100" xcss={aboveStyles} />
        </Inline>
      </Stack>
    </Box>
  );
}
