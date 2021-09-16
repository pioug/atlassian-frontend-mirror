/** @jsx jsx */

import { Component, FC, SyntheticEvent } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { N500 } from '@atlaskit/theme/colors';

import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}

const SidebarOverrideComponent: FC = ({ children }) => {
  return (
    <div
      style={{
        alignItems: 'center',
        boxSizing: 'border-box',
        color: N500,
        display: 'flex',
        flexShrink: 0,
        flexDirection: 'column',
        height: '100vh',
        paddingBottom: 16,
        paddingTop: 24,
        width: 64,
        border: '3px dashed teal',
      }}
    >
      {children}
      Sidebar Override
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
            Sidebar: {
              component: SidebarOverrideComponent,
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
