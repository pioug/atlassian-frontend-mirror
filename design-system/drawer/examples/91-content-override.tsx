/** @jsx jsx */

import { Component, FC, SyntheticEvent } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}

const ContentOverrideComponent: FC = ({ children }) => {
  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        marginTop: 24,
        border: '3px dashed pink',
      }}
    >
      {children}
      Content Override
    </div>
  );
};

export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
    });

  onClose = (...args: [SyntheticEvent, any]) => {
    console.log('onClose', args);
    this.setState({
      isDrawerOpen: false,
    });
  };

  onCloseComplete = (...args: [HTMLElement]) =>
    console.log('onCloseComplete', args);

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          isOpen={this.state.isDrawerOpen}
          width="narrow"
          overrides={{
            Content: {
              component: ContentOverrideComponent,
            },
          }}
        >
          Normal Drawer content
        </Drawer>
        <Button id="open-drawer" type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}
