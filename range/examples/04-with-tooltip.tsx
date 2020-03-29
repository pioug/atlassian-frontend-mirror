import React, { Component } from 'react';
import Tooltip from '@atlaskit/tooltip';
import Range from '../src';

interface State {
  value: number;
}

export default class SimpleRange extends Component<{}, State> {
  state = {
    value: 50,
  };

  render() {
    return (
      <div style={{ paddingTop: '40px' }}>
        <Tooltip position="top" content={this.state.value}>
          <Range
            step={1}
            value={this.state.value}
            onChange={value => this.setState({ value })}
          />
        </Tooltip>
      </div>
    );
  }
}
