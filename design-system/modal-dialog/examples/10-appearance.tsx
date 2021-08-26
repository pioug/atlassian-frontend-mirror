import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';
import { Appearance } from '../src/types';

const appearances: Appearance[] = ['warning', 'danger'];

export default function ExampleAppearance() {
  const [appearance, setAppearance] = useState<Appearance | null>(null);
  const open = useCallback((name: Appearance) => setAppearance(name), []);
  const close = useCallback(() => setAppearance(null), []);

  return (
    <div>
      <ButtonGroup>
        {appearances.map((name) => (
          <Button
            key={`${name}-trigger`}
            testId={name}
            onClick={() => open(name)}
          >
            Open: {name}
          </Button>
        ))}
      </ButtonGroup>

      <ModalTransition>
        {appearance && (
          <Modal key="active-modal" onClose={close} testId="modal">
            <ModalHeader>
              <ModalTitle appearance={appearance}>
                Modal: {appearance}
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Lorem count={2} />
            </ModalBody>
            <ModalFooter>
              <Button testId="secondary" appearance="subtle">
                Secondary Action
              </Button>
              <Button
                autoFocus
                testId={appearance}
                appearance={appearance}
                onClick={close}
              >
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
