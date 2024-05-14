import React from 'react';

import { Box, Grid, Stack } from '@atlaskit/primitives';

import Heading from '../src';

export default () => {
  return (
    <Box backgroundColor="color.background.brand.bold">
      <Grid templateColumns="1fr 1fr" gap="space.100">
        <Stack testId="headings">
          <Heading level="h900" color="inverse">
            inverse
          </Heading>
        </Stack>
        <Stack testId="headings">
          <Heading size="xxlarge">inverse</Heading>
        </Stack>
      </Grid>
    </Box>
  );
};
