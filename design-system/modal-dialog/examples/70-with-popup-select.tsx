import React, { useCallback, useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { PopupSelect } from '@atlaskit/select';

import ModalDialog, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

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

export default function ModalWithPopupSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <Button appearance="primary" onClick={open}>
        Open Modal
      </Button>
      <ModalTransition>
        {isOpen && (
          <ModalDialog onClose={close}>
            <ModalHeader>
              <ModalTitle>Modal with popup select</ModalTitle>
              <IconButton
                onClick={close}
                icon={CrossIcon}
                label="Close Modal"
                UNSAFE_size="small"
              />
            </ModalHeader>
            <ModalBody>
              <PopupSelect
                options={options}
                placeholder="Choose a City"
                searchThreshold={10}
                target={({ ref }) => <Button ref={ref}>Choose</Button>}
              />
            </ModalBody>
          </ModalDialog>
        )}
      </ModalTransition>
    </>
  );
}
