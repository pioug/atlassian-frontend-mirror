import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import Select from '@atlaskit/select';

import Modal, { ModalFooter, ModalTransition } from '../src';

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

const DefaultModal = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const Footer = () => {
    return (
      <ModalFooter>
        <Button onClick={close}>test button</Button>
      </ModalFooter>
    );
  };
  return (
    <div>
      <Button onClick={open}>Open Modal</Button>
      <ModalTransition>
        {isOpen && (
          <Modal
            components={{
              Footer: Footer,
            }}
            onClose={close}
            heading="Modal Title"
          >
            <div data-testid="dialog-body">
              <SingleExample />
            </div>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
};

export default DefaultModal;
