/** @jsx jsx */

import { Component, FC, SyntheticEvent } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

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
        // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
        border: `3px dashed ${token(
          'color.background.accent.purple.subtle',
          'pink',
        )}`,
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

  onCloseComplete = (args: any) => console.log('onCloseComplete', args);

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          isOpen={this.state.isDrawerOpen}
          width="narrow"
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
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
