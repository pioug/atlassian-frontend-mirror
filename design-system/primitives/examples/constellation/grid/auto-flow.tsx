import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Basic() {
  return (
    <Grid autoFlow="column" gap="space.200">
      <Block />
      <Block />
      <Block />
    </Grid>
  );
}
