import React from 'react';
import { Component } from 'react';
import StatefulAvatarPickerDialog from '../example-helpers/StatefulAvatarPickerDialog';
import {
  CONTAINER_SIZE,
  CONTAINER_PADDING,
} from '../src/avatar-picker-dialog/layout-const';
import { ViewportDebugger } from '../example-helpers/viewport-debug';

class Example extends Component<{}, {}> {
  debugView?: ViewportDebugger;

  componentDidMount = () => {
    this.debugView = new ViewportDebugger(
      { x: 10, y: 10 },
      { x: 10 + CONTAINER_PADDING, y: CONTAINER_SIZE + 20 },
    );
  };

  render() {
    return <StatefulAvatarPickerDialog />;
  }
}

export default () => <Example />;
