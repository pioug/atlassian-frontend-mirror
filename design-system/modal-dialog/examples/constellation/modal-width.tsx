import React, { useCallback, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../../src';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState('medium');

  const closeModal = useCallback(() => setIsOpen(false), [setIsOpen]);
  const setWidthAndOpen = useCallback(
    (newWidth: string) => {
      setWidth(newWidth);
      requestAnimationFrame(() => setIsOpen(true));
    },
    [setWidth, setIsOpen],
  );

  return (
    <>
      <ButtonGroup appearance="primary">
        <Button onClick={() => setWidthAndOpen('small')}>small</Button>
        <Button onClick={() => setWidthAndOpen('medium')}>medium</Button>
        <Button onClick={() => setWidthAndOpen('large')}>large</Button>
        <Button onClick={() => setWidthAndOpen('x-large')}>x-large</Button>
      </ButtonGroup>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal} width={width}>
            <ModalHeader>
              <ModalTitle>Easily set up your own projects</ModalTitle>
            </ModalHeader>
            <ModalBody>
              We simplified the way you set up issue types, workflows, fields,
              and screens. Check out the new, independent project experience to
              see it in action.
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle">Skip</Button>
              <Button appearance="primary" onClick={closeModal} autoFocus>
                Get started
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
}
