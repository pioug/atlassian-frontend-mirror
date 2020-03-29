import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';
import Toggle, { ToggleStateless } from '../src';

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
        <ToggleStateless
          isChecked={this.state.isChecked}
          testId="my-toggle-stateless"
        />
        <p style={{ marginBottom: gridSize() }}>
          Can use this button to trigger a toggle
        </p>
        <Button
          appearance="primary"
          onClick={this.toggle}
          testId="my-toggle-button"
        >
          Toggle
        </Button>
        <p>Regular</p>
        <Toggle testId="my-regular-stateful-toggle" />
        <p>Large (checked by default)</p>
        <Toggle
          size="large"
          isDefaultChecked
          testId="my-large-stateful-toggle"
        />
      </div>
    );
  }
}
