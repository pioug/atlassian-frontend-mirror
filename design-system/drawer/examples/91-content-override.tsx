/** @jsx jsx */

import { Component, FC, ReactNode, SyntheticEvent } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}

const ContentOverrideComponent: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        marginTop: token('space.300', '24px'),
        // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
        border: `3px dashed ${token('color.background.accent.purple.subtle')}`,
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
      <div style={{ padding: token('space.400', '2rem') }}>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          isOpen={this.state.isDrawerOpen}
          width="narrow"
          label="Drawer with custom content override"
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
