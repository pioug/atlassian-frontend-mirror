import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
} from '@atlaskit/ds-explorations';
import Heading from '@atlaskit/heading';
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
    <Stack gap="scale.250">
      <Heading level="h700">
        Click dropdown button and try to open the modal using your keyboard.
      </Heading>

      <Box>
        <DropdownMenu
          trigger="Open dropdown"
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
      </Box>

      <ModalTransition>
        {isModalOpen && (
          <ModalDialog testId="dialogBox" onClose={() => setModalOpen(false)}>
            <ModalHeader>
              <ModalTitle>Hi there</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <Box paddingBlock="scale.250">
                <Button onClick={() => setModalOpen(false)}>Close modal</Button>
                <DropdownMenu
                  trigger="Open dropdown"
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
              </Box>
            </ModalBody>
          </ModalDialog>
        )}
      </ModalTransition>
    </Stack>
  );
};
