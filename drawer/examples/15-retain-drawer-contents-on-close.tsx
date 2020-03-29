/** @jsx jsx */

import { jsx } from '@emotion/core';
import { Component } from 'react';
import Button from '@atlaskit/button';
import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
  shouldUnmountOnExit: boolean;
}
export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
    shouldUnmountOnExit: true,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
    });

  closeDrawer = () =>
    this.setState({
      isDrawerOpen: false,
    });

  toggleUnmountBehaviour = () => {
    this.setState(({ shouldUnmountOnExit: shouldUnmountOnExitValue }) => ({
      shouldUnmountOnExit: !shouldUnmountOnExitValue,
    }));
  };

  render() {
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer
          onClose={this.closeDrawer}
          isOpen={this.state.isDrawerOpen}
          width="wide"
          shouldUnmountOnExit={this.state.shouldUnmountOnExit}
        >
          <label htmlFor="textbox" css={{ display: 'block' }}>
            Type something in the textarea below and see if it is retained
          </label>
          <textarea id="textbox" rows={50} cols={50} />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
        <div css={{ marginTop: '2rem' }}>
          <label htmlFor="checkbox">
            <input
              id="checkbox"
              type="checkbox"
              checked={this.state.shouldUnmountOnExit}
              onChange={this.toggleUnmountBehaviour}
            />
            Toggle remounting of drawer contents on exit
          </label>
          <div css={{ display: 'block', paddingTop: '1rem' }}>
            Contents of the drawer will be{' '}
            <strong>{`${
              this.state.shouldUnmountOnExit ? 'discarded' : 'retained'
            }`}</strong>{' '}
            on closing the drawer
          </div>
        </div>
      </div>
    );
  }
}
