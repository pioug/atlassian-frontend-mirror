import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Square from '../shared/square';

export default function Basic() {
  return (
    <Grid gap="space.200" alignItems="center">
      <Grid testId="grid-basic" gap="space.100">
        <Square />
        <Square />
        <Square />
      </Grid>
      <Grid testId="grid-basic" gap="space.200">
        <Square />
        <Square />
        <Square />
      </Grid>
      <Grid testId="grid-basic" gap="space.400">
        <Square />
        <Square />
        <Square />
      </Grid>
    </Grid>
  );
}
