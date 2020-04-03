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

  secondaryAction = () => alert('Secondary button has been clicked!');

  render() {
    const { isOpen } = this.state;
    const actions = [
      { text: 'Close', onClick: this.close, testId: 'close' },
      {
        text: 'Secondary Action',
        onClick: this.secondaryAction,
        testId: 'cancel',
      },
    ];
    console.log(actions);
    return (
      <div>
        <Button testId={'open-modal'} onClick={this.open}>
          Open Modal
        </Button>

        <ModalTransition>
          {isOpen && (
            <Modal
              actions={actions}
              onClose={this.close}
              heading="Modal Title"
              testId={'my-modal'}
            >
              <Lorem count={2} />
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
}
