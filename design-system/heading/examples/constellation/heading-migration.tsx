import React, { Fragment } from 'react';

import { Grid } from '@atlaskit/primitives';

import Heading from '../../src';

export default () => {
  return (
    <Fragment>
      <style>{`:root { --ds-font-family-heading: sans-serif; }`}</style>
      <Grid templateColumns="1fr 1fr" gap="space.100" alignItems="baseline">
        <Heading size="xsmall">Old</Heading>
        <Heading size="xsmall">Replace with</Heading>
        <Heading level="h900">h900</Heading>
        <Heading size="xxlarge">xxlarge</Heading>
        <Heading level="h800">h800</Heading>
        <Heading size="xlarge">xlarge</Heading>
        <Heading level="h700">h700</Heading>
        <Heading size="large">large</Heading>
        <Heading level="h600">h600</Heading>
        <Heading size="medium">medium</Heading>
        <Heading level="h500">h500</Heading>
        <Heading size="small">small</Heading>
        <Heading level="h400">h400</Heading>
        <Heading size="xsmall">xsmall</Heading>
        <Heading level="h300">h300</Heading>
        <Heading size="xxsmall">xxsmall</Heading>
        <Heading level="h200">h200</Heading>
        <Heading size="xxsmall">xxsmall</Heading>
        <Heading level="h100">h100</Heading>
        <Heading size="xxsmall">xxsmall</Heading>
      </Grid>
    </Fragment>
  );
};
