import React, { PureComponent } from 'react';

import styled from 'styled-components';

import Page, { Grid, GridColumn } from '../src';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const Dummy = styled.div`
  background: #fea;
`;

export default class LayoutExample extends PureComponent<void, void> {
  render() {
    return (
      <div>
        <h2>Default Layout</h2>
        <Page>
          <Grid>
            <GridColumn medium={4}>
              <Dummy>4 col</Dummy>
            </GridColumn>
            <GridColumn medium={4}>
              <Dummy>4 col</Dummy>
            </GridColumn>
            <GridColumn medium={3}>
              <Dummy>3 col</Dummy>
            </GridColumn>
            <GridColumn medium={1}>
              <Dummy>1 col</Dummy>
            </GridColumn>
            <GridColumn>
              <Dummy>Unspecified</Dummy>
            </GridColumn>
          </Grid>
        </Page>
        <h2>Fluid Layout</h2>
        <Page>
          <Grid layout="fluid">
            <GridColumn medium={4}>
              <Dummy>4 col</Dummy>
            </GridColumn>
            <GridColumn medium={4}>
              <Dummy>4 col</Dummy>
            </GridColumn>
            <GridColumn medium={3}>
              <Dummy>3 col</Dummy>
            </GridColumn>
            <GridColumn medium={1}>
              <Dummy>1 col</Dummy>
            </GridColumn>
            <GridColumn>
              <Dummy>Unspecified</Dummy>
            </GridColumn>
          </Grid>
        </Page>
      </div>
    );
  }
}
