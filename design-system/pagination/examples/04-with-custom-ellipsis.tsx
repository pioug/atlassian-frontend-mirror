import React, { Component, Fragment } from 'react';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import Pagination from '../src';

export default class extends Component<{}, { max: number }> {
  state = {
    max: 7,
  };

  handleEllipsisCLick = () => {
    this.setState({
      max: 10,
    });
  };

  render() {
    return (
      <Fragment>
        <div style={{ marginBottom: '10px' }}>
          <SectionMessage title="Using the example">
            <p>Please click on the ellipsis to expand the Pagination</p>
          </SectionMessage>
        </div>
        <Pagination
          renderEllipsis={({ key }: { key: string }) => (
            <Button
              onClick={() => this.handleEllipsisCLick()}
              appearance="subtle"
              key={key}
              aria-label="expand"
            >
              ...
            </Button>
          )}
          max={this.state.max}
          pages={[...Array(10)].map((_, i) => i + 1)}
        />
      </Fragment>
    );
  }
}
