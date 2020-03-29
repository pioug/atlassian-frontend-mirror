import React, { Component, Fragment } from 'react';
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
      <Fragment>
        <Range
          step={1}
          value={this.state.value}
          onChange={value => this.setState({ value })}
        />
        <p>The current value is: {this.state.value}</p>
      </Fragment>
    );
  }
}
