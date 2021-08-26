import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import ModalDialog, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

export default () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ margin: '20px' }}>
      <h2 style={{ margin: ' 0 0 20px' }}>
        Click dropdown button and try to open the modal using your keyboard.
      </h2>

      <DropdownMenu
        trigger="Open dropdown"
        triggerType="button"
        testId="dropdown"
        onOpenChange={(e) => console.log('dropdown opened', e)}
      >
        <DropdownItemGroup>
          <DropdownItem
            onClick={(e: React.MouseEvent | React.KeyboardEvent) => {
              e.preventDefault();

              setModalOpen(true);
            }}
          >
            Open modal
          </DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>

      <ModalTransition>
        {isModalOpen && (
          <ModalDialog testId="dialogBox" onClose={() => setModalOpen(false)}>
            <ModalHeader>
              <ModalTitle>Hi there</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <div style={{ padding: '20px 0' }}>
                <Button onClick={() => setModalOpen(false)}>Close modal</Button>
              </div>
            </ModalBody>
          </ModalDialog>
        )}
      </ModalTransition>
    </div>
  );
};
