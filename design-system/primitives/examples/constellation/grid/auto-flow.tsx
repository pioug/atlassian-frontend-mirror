import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Square from '../shared/square';

export default function Basic() {
  return (
    <Grid autoFlow="column" gap="space.200">
      <Square />
      <Square />
      <Square />
    </Grid>
  );
}
