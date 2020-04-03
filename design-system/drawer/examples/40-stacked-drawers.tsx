import React, { Component, SyntheticEvent } from 'react';
import Button from '@atlaskit/button';
import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
  isNestedDrawerOpen: boolean;
}
export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
    isNestedDrawerOpen: false,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
      isNestedDrawerOpen: false,
    });

  openNestedDrawer = () =>
    this.setState({
      isNestedDrawerOpen: true,
    });

  onClose = (...args: [SyntheticEvent, any]) => {
    console.log('onClose', args);
    this.setState({
      isDrawerOpen: false,
      isNestedDrawerOpen: false,
    });
  };

  onNestedClose = (...args: [SyntheticEvent, any]) => {
    console.log('onClose Nested', args);
    this.setState({
      isNestedDrawerOpen: false,
    });
  };

  onCloseComplete = (...args: [HTMLElement]) =>
    console.log('onCloseComplete', args);

  onNestedCloseComplete = (...args: [HTMLElement]) =>
    console.log('onNestedCloseComplete', args);

  render() {
    return (
      <div css={{ padding: '2rem' }}>
        <div css={{ padding: '2rem' }}>
          <Drawer
            onClose={this.onNestedClose}
            onCloseComplete={this.onNestedCloseComplete}
            isOpen={this.state.isNestedDrawerOpen}
            width="full"
          >
            <code>Nested Drawer contents</code>
          </Drawer>
        </div>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          isOpen={this.state.isDrawerOpen}
          width="narrow"
        >
          <code>Drawer contents</code>
          <div css={{ padding: '2rem' }}>
            <Button
              id="open-drawer"
              type="button"
              onClick={this.openNestedDrawer}
            >
              Open Nested drawer
            </Button>
          </div>
        </Drawer>
        <Button id="open-drawer" type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}
