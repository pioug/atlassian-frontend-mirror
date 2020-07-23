import React, { Component } from 'react';

import Button from '@atlaskit/button';

import { ToggleStateless } from '../../src';

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
        <p>
          Interacting with this stateless toggle will not change the state by
          default
        </p>
        <ToggleStateless isChecked={this.state.isChecked} />
        <p>Use this button to trigger the toggle</p>
        <Button appearance="primary" onClick={this.toggle}>
          Toggle the state
        </Button>
      </div>
    );
  }
}
