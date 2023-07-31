import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Square from '../shared/block';

export default function Basic() {
  return (
    <Grid
      testId="grid-basic"
      gap="space.200"
      templateAreas={[
        'navigation navigation navigation',
        'sidenav content content',
        'footer footer footer',
      ]}
    >
      <Square style={{ gridArea: 'navigation' }} />
      <Square style={{ gridArea: 'sidenav' }} />
      <Square style={{ gridArea: 'content' }} />
      <Square style={{ gridArea: 'footer' }} />
    </Grid>
  );
}
