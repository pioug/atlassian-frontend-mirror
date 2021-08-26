import React, { Component } from 'react';
import Modal, {
  ModalTransition,
  ModalBody,
  ModalTitle,
  ModalHeader,
  ModalFooter,
} from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button/standard-button';
import Select from '../src';

interface State {
  isOpen: boolean;
}

const options = [
  { label: 'Adelaide', value: 'adelaide' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

export default class SelectInModal extends Component<{}, State> {
  state: State = { isOpen: false };

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  render() {
    const { isOpen } = this.state;

    return (
      <div>
        <Button onClick={this.open}>Open Modal</Button>

        <ModalTransition>
          {isOpen && (
            <Modal onClose={this.close}>
              <ModalHeader>
                <ModalTitle>Modal Title</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Select
                  menuPortalTarget={document.body}
                  isMulti
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  defaultValue={options.slice(3)}
                  options={options}
                  placeholder="Choose a City"
                />
              </ModalBody>
              <ModalFooter>
                <Button appearance="primary" onClick={this.close}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
}
