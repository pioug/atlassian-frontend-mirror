/** @jsx jsx */

import { Component, SyntheticEvent } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}

const stackingStyles = css({
  position: 'fixed',
  zIndex: '1',
});

const visualStyles = css({
  padding: token('space.300', '24px'),
  backgroundColor: token('color.background.neutral'),
  border: `1px solid ${token('color.background.accent.gray.subtle')}`,
});

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

  onCloseComplete = (args: any) => console.log('onCloseComplete', args);

  onOpenComplete = (args: any) => console.log('onOpenComplete', args);

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          onOpenComplete={this.onOpenComplete}
          isOpen={this.state.isDrawerOpen}
          width="wide"
          testId="drawer"
          label="Drawer focus trap"
        >
          <code>Content</code>
        </Drawer>
        <div css={[visualStyles, stackingStyles]}>
          <p>
            This area should appear behind the blanket from the drawer,
            including during the blanket fade-in animation that creates a new
            stacking context
          </p>
          <Button
            id="open-drawer"
            type="button"
            onClick={this.openDrawer}
            testId="open-button"
          >
            Open drawer
          </Button>
        </div>
      </div>
    );
  }
}
