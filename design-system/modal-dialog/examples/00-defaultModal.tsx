import React from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';

import Modal, { ModalTransition } from '../src';

interface State {
  isOpen: boolean;
}
export default class DefaultModal extends React.PureComponent<{}, State> {
  state: State = { isOpen: false };

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  secondaryAction = () => alert('Secondary button has been clicked!');

  render() {
    const { isOpen } = this.state;
    const actions = [
      { text: 'Close', onClick: this.close, testId: 'primary' },
      {
        text: 'Secondary Action',
        onClick: this.secondaryAction,
        testId: 'secondary',
      },
    ];

    return (
      <div>
        <Button onClick={this.open} testId="modal-trigger">
          Open Modal
        </Button>

        <ModalTransition>
          {isOpen && (
            <Modal
              actions={actions}
              onClose={this.close}
              heading="Modal Title"
              testId="modal"
            >
              <Lorem count={2} />
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
}
