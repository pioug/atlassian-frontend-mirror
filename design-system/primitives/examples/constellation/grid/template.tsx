import React from 'react';

import { Grid } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Basic() {
  return (
    <Grid gap="space.200" alignItems="center">
      <Grid
        testId="grid-basic"
        rowGap="space.200"
        columnGap="space.400"
        templateColumns="1fr 100px 1fr"
      >
        <Block />
        <Block />
        <Block />
        <Block />
        <Block />
        <Block />
      </Grid>
      <Grid
        testId="grid-basic"
        rowGap="space.200"
        columnGap="space.400"
        templateRows="3rem 2rem"
      >
        <Block />
        <Block />
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
        <Block style={{ gridArea: 'navigation' }} />
        <Block style={{ gridArea: 'sidenav' }} />
        <Block style={{ gridArea: 'content' }} />
        <Block style={{ gridArea: 'footer' }} />
      </Grid>
    </Grid>
  );
}
