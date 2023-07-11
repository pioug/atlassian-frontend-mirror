import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Square from '../shared/square';

export default function Basic() {
  return (
    <Grid gap="space.200" alignItems="center">
      <Square />
      <Square />
      <Square />
    </Grid>
  );
}
