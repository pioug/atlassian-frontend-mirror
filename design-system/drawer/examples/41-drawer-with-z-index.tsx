/** @jsx jsx */

import { Component, SyntheticEvent } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import Modal from '@atlaskit/modal-dialog';
import { layers } from '@atlaskit/theme/constants';

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

  onCloseComplete = (args: any) => console.log('onCloseComplete', args);

  onOpenComplete = (args: any) => console.log('onOpenComplete', args);

  render() {
    return (
      <div style={{ padding: '2rem' }}>
        <Modal>
          <div style={{ padding: '2rem' }}>This is a modal</div>
          <Drawer
            onClose={this.onClose}
            onCloseComplete={this.onCloseComplete}
            onOpenComplete={this.onOpenComplete}
            isOpen={this.state.isDrawerOpen}
            width="wide"
            zIndex={layers.modal()}
            label="Drawer layer precedence"
          >
            <code>Content</code>
          </Drawer>

          <Button id="open-drawer" type="button" onClick={this.openDrawer}>
            Open drawer
          </Button>
        </Modal>
      </div>
    );
  }
}
