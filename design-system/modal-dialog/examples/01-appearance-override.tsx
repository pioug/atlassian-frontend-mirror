import React from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';

import Modal, { ActionProps, ModalTransition } from '../src';

interface State {
  isOpen: boolean;
}
export default class DefaultModal extends React.PureComponent<{}, State> {
  state: State = { isOpen: false };

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  secondaryAction = ({ target }: any) => console.log(target.innerText);

  render() {
    const { isOpen } = this.state;
    const actions: ActionProps[] = [
      {
        appearance: 'default',
        text: 'Close',
        onClick: this.close,
      },
      {
        appearance: 'primary',
        text: 'Secondary Action',
        onClick: this.secondaryAction,
      },
    ];

    return (
      <div>
        <Button onClick={this.open}>Open Modal</Button>

        <ModalTransition>
          {isOpen && (
            <Modal actions={actions} onClose={this.close} heading="Modal Title">
              <Lorem count={2} />
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
}
