/** @jsx jsx */
import { jsx } from '@emotion/react';

import Grid, { GridItem } from '../src';

export default () => (
  <Grid testId="grid">
    <GridItem>visible</GridItem>
    <GridItem span="none">hidden: all breakpoints</GridItem>
    <GridItem span={{ md: 'none' }}>hidden: md and up</GridItem>
    <GridItem>visible</GridItem>
  </Grid>
);
