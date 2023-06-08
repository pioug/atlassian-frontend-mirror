import React from 'react';

import { Box, Inline, Stack, xcss } from '../src';

const aboveStyles = xcss({
  '@media (min-width: 0rem)': {
    ':after': {
      content: '"(min-width: 0rem)"',
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
  '@media (min-width: 135rem)': {
    ':after': {
      content: '"(min-width: 135rem)"',
    },
  },
});

const belowStyles = xcss({
  '@media (max-width: 134.998rem)': {
    ':after': {
      content: '"(max-width: 134.998rem)"',
    },
  },
  '@media (max-width: 109.998rem)': {
    ':after': {
      content: '"(max-width: 109.998rem)"',
    },
  },
  '@media (max-width: 89.998rem)': {
    ':after': {
      content: '"(max-width: 89.998rem)"',
    },
  },
  '@media (max-width: 63.998rem)': {
    ':after': {
      content: '"(max-width: 63.998rem)"',
    },
  },
  '@media (max-width: 47.998rem)': {
    ':after': {
      content: '"(max-width: 47.998rem)"',
    },
  },
  '@media (max-width: 29.998rem)': {
    ':after': {
      content: '"(max-width: 29.998rem)"',
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
        <Inline alignBlock="center">
          <Box as="span">Below:</Box>
          <Box testId="box-below-mq" padding="space.100" xcss={belowStyles} />
        </Inline>
      </Stack>
    </Box>
  );
}
