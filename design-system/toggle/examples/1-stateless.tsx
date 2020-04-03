import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';
import { ToggleStateless } from '../src';

interface State {
  isChecked: boolean;
}

export default class StatelessExample extends Component<any, State> {
  state: State = {
    isChecked: false,
  };

  toggle = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  };

  render() {
    return (
      <div>
        <p>Interacting will not do anything by default</p>
        <ToggleStateless isChecked={this.state.isChecked} />
        <p style={{ marginBottom: gridSize() }}>
          Can use this button to trigger a toggle
        </p>
        <Button appearance="primary" onClick={this.toggle}>
          Toggle
        </Button>
      </div>
    );
  }
}
