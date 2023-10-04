import React from 'react';

import { Grid, Stack } from '@atlaskit/primitives';

import Heading from '../src';

export default () => {
  return (
    <Grid templateColumns="1fr 1fr" gap="space.100">
      <Stack testId="headings" space="space.100">
        <Heading level="h900">h900</Heading>
        <Heading level="h800">h800</Heading>
        <Heading level="h700">h700</Heading>
        <Heading level="h600">h600</Heading>
        <Heading level="h500">h500</Heading>
        <Heading level="h400">h400</Heading>
        <Heading level="h300">h300</Heading>
        <Heading level="h200">h200</Heading>
        <Heading level="h100">h100</Heading>
      </Stack>
      <Stack testId="headings" space="space.100">
        <style>{`:root { --ds-font-family-heading: sans-serif; }`}</style>
        <Heading variant="xxlarge">xxlarge</Heading>
        <Heading variant="xlarge">xlarge</Heading>
        <Heading variant="large">large</Heading>
        <Heading variant="medium">medium</Heading>
        <Heading variant="small">small</Heading>
        <Heading variant="xsmall">xsmall</Heading>
        <Heading variant="xxsmall">xxsmall</Heading>
      </Stack>
    </Grid>
  );
};
