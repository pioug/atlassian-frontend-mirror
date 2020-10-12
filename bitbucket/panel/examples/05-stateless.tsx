import React, { Component } from 'react';

import Page, { Grid, GridColumn } from '@atlaskit/page';

import { PanelStateless } from '../src';

const Header = <span>This is stateless panel example</span>;

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component {
  state = {
    isExpanded: false,
  };

  handleChange = (isExpanded: boolean) => {
    this.setState({ isExpanded });
  };

  render() {
    return (
      <Page>
        <Grid layout="fixed">
          <GridColumn medium={2} />
          <GridColumn medium={8}>
            <PanelStateless
              header={Header}
              isExpanded={this.state.isExpanded}
              onChange={this.handleChange}
            >
              <p>
                Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
                ullamco deserunt aute id consequat veniam incididunt duis in
                sint irure nisi. Mollit officia cillum Lorem ullamco minim
                nostrud elit officia tempor esse quis.
              </p>
            </PanelStateless>
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}
