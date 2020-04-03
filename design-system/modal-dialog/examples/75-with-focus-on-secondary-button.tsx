import React from 'react';
import Lorem from 'react-lorem-component';
import Button from '@atlaskit/button';
import Modal, { ModalTransition } from '../src';

interface State {
  isOpen: boolean;
}
export default class ExampleBasic extends React.PureComponent<{}, State> {
  state: State = { isOpen: false };

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  secondaryAction = ({ currentTarget }: React.MouseEvent<HTMLElement>) =>
    console.log(currentTarget.innerText);

  render() {
    const { isOpen } = this.state;
    const actions = [
      { text: 'Delete', onClick: this.close },
      {
        text: 'Cancel',
        onClick: this.secondaryAction,
        autoFocus: true,
      },
    ];

    return (
      <div>
        <Button onClick={this.open}>Open Modal</Button>

        <ModalTransition>
          {isOpen && (
            <Modal
              actions={actions}
              appearance="danger"
              onClose={this.close}
              heading="Delete Repository"
            >
              <Lorem count={2} />
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
}
