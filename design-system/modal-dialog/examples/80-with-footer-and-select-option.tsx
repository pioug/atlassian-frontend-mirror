import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import Select from '@atlaskit/select';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

const SingleExample = () => (
  <Select
    className="single-select"
    classNamePrefix="react-select"
    options={[
      { label: 'Adelaide', value: 'adelaide' },
      { label: 'Brisbane', value: 'brisbane' },
      { label: 'Canberra', value: 'canberra' },
      { label: 'Darwin', value: 'darwin' },
      { label: 'Hobart', value: 'hobart' },
      { label: 'Melbourne', value: 'melbourne' },
      { label: 'Perth', value: 'perth' },
      { label: 'Sydney', value: 'sydney' },
    ]}
    placeholder="Choose a City"
    // Make it appear over the top of the modal rather than scrollable
    menuPosition="fixed"
  />
);

export default function DefaultModal() {
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const Footer = () => {
    return (
      <ModalFooter>
        <Button style={{ marginRight: 'auto' }} onClick={close}>
          test button
        </Button>
      </ModalFooter>
    );
  };

  return (
    <div>
      <Button onClick={open} testId="modal-trigger">
        Open Modal
      </Button>
      <ModalTransition>
        {isOpen && (
          <Modal onClose={close} testId="modal">
            <ModalHeader>
              <ModalTitle>Modal Title</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div data-testid="dialog-body">
                <SingleExample />
              </div>
            </ModalBody>
            <Footer />
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
