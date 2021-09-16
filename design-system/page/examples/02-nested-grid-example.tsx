import React, { PureComponent } from 'react';

import styled from 'styled-components';

import Page, { Grid, GridColumn } from '../src';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const Dummy = styled.div`
  background: #fea;
`;
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const DummyNested = styled.div`
  background: #afe;
`;

export default class LayoutExample extends PureComponent<void, void> {
  render() {
    return (
      <div>
        <h2>Nested Grid</h2>
        <Page>
          <Grid spacing="cosy">
            <GridColumn medium={8}>
              <Dummy>
                This content sits inside a column of width 8. The text is before
                the nested grid.
                <Grid>
                  <GridColumn medium={4}>
                    <DummyNested>4 col</DummyNested>
                  </GridColumn>
                  <GridColumn medium={4}>
                    <DummyNested>4 col</DummyNested>
                  </GridColumn>
                </Grid>
                This content sits after the nested grid. Notice how the grid
                pulls itself out into the margins of the column its in.
              </Dummy>
            </GridColumn>
            <GridColumn medium={4}>
              <Dummy>4 col</Dummy>
            </GridColumn>
          </Grid>
        </Page>
      </div>
    );
  }
}
