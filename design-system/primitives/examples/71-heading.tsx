import React from 'react';

import { Box, Stack } from '@atlaskit/primitives';

import Heading from '../src/components/heading';

export default () => {
  return (
    <Stack testId="headings" space="space.0">
      {(['xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs'] as const).map(level => (
        <Heading key={level} level={level}>
          Heading {level.toUpperCase()}
        </Heading>
      ))}
      <Box backgroundColor="color.background.brand.bold">
        <Heading level="xxl" color="inverse">
          inverse
        </Heading>
      </Box>
    </Stack>
  );
};
