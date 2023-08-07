import React from 'react';

import { Grid } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

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
      <ExampleBox style={{ gridArea: 'navigation' }} />
      <ExampleBox style={{ gridArea: 'sidenav' }} />
      <ExampleBox style={{ gridArea: 'content' }} />
      <ExampleBox style={{ gridArea: 'footer' }} />
    </Grid>
  );
}
