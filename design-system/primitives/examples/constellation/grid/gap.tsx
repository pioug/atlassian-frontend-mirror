import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Basic() {
  return (
    <Grid gap="space.200" alignItems="center">
      <Grid templateColumns="1fr 1fr" testId="grid-basic" gap="space.100">
        <Block />
        <Block />
        <Block />
        <Block />
      </Grid>
      <Grid templateColumns="1fr 1fr" testId="grid-basic" gap="space.200">
        <Block />
        <Block />
        <Block />
        <Block />
      </Grid>
      <Grid templateColumns="1fr 1fr" testId="grid-basic" gap="space.400">
        <Block />
        <Block />
        <Block />
        <Block />
      </Grid>
    </Grid>
  );
}
