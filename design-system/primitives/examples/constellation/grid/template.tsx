import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Square from '../shared/block';

export default function Basic() {
  return (
    <Grid
      testId="grid-basic"
      rowGap="space.200"
      columnGap="space.400"
      templateColumns="1fr 100px 1fr"
    >
      <Square />
      <Square />
      <Square />
      <Square />
      <Square />
      <Square />
    </Grid>
  );
}
