/** @jsx jsx */

import { Component, FC, ReactNode, SyntheticEvent } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}

const SidebarOverrideComponent: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        alignItems: 'center',
        boxSizing: 'border-box',
        color: token('color.text.subtle', N500),
        display: 'flex',
        flexShrink: 0,
        flexDirection: 'column',
        height: '100vh',
        paddingBottom: token('space.200', '16px'),
        paddingTop: token('space.300', '24px'),
        width: 64,
        // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
        border: `3px dashed ${token(
          'color.background.accent.teal.subtle',
          'teal',
        )}`,
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

  onCloseComplete = (args: any) => console.log('onCloseComplete', args);

  render() {
    return (
      <div style={{ padding: token('space.400', '2rem') }}>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          isOpen={this.state.isDrawerOpen}
          width="narrow"
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
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
