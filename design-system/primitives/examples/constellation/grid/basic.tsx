import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Basic() {
  return (
    <Grid gap="space.200" alignItems="center">
      <Block />
      <Block />
      <Block />
    </Grid>
  );
}
