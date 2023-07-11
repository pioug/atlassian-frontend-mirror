import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Square from '../shared/square';

export default function Basic() {
  return (
    <Grid gap="space.200" alignItems="center">
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
      <Grid
        testId="grid-basic"
        rowGap="space.200"
        columnGap="space.400"
        templateRows="3rem 2rem"
      >
        <Square />
        <Square />
      </Grid>
      <Grid
        testId="grid-basic"
        gap="space.200"
        templateAreas={[
          'navigation navigation',
          'sidenav content',
          'footer footer',
        ]}
      >
        <Square style={{ gridArea: 'navigation' }} />
        <Square style={{ gridArea: 'sidenav' }} />
        <Square style={{ gridArea: 'content' }} />
        <Square style={{ gridArea: 'footer' }} />
      </Grid>
    </Grid>
  );
}
