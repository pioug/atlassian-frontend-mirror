/** @jsx jsx */

import { jsx } from '@emotion/core';
import { Component, SyntheticEvent } from 'react';
import Button from '@atlaskit/button';
import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}
export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
    });

  onClose = (...args: [SyntheticEvent<HTMLElement>, any]) => {
    console.log('onClose', args);
    this.setState({
      isDrawerOpen: false,
    });
  };

  onCloseComplete = (...args: [HTMLElement]) =>
    console.log('onCloseComplete', args);

  onOpenComplete = (...args: [HTMLElement]) =>
    console.log('onOpenComplete', args);

  render() {
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          onOpenComplete={this.onOpenComplete}
          isOpen={this.state.isDrawerOpen}
          width="wide"
        >
          <code>Drawer contents</code>
        </Drawer>
        <Button id="open-drawer" type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}
