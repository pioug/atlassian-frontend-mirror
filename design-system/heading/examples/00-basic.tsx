import React from 'react';

import { Box, Stack } from '@atlaskit/primitives';

import Heading from '../src';

export default () => {
  return (
    <Stack testId="headings" space="space.0">
      <Heading level="h100">h100</Heading>
      <Heading level="h200">h200</Heading>
      <Heading level="h300">h300</Heading>
      <Heading level="h400">h400</Heading>
      <Heading level="h500">h500</Heading>
      <Heading level="h600">h600</Heading>
      <Heading level="h700">h700</Heading>
      <Heading level="h800">h800</Heading>
      <Heading level="h900">h900</Heading>
      <Box backgroundColor="brand.bold">
        <Heading level="h900" color="inverse">
          inverse
        </Heading>
      </Box>
    </Stack>
  );
};
