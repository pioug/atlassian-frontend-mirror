import React, { useCallback, useRef, useState } from 'react';

import { findByTestId, findByText, fireEvent } from '@testing-library/dom';
import Lorem from 'react-lorem-component';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Button from '@atlaskit/button/standard-button';

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '../src';

const openText = 'Open modal';
const closeText = 'Close';
const scrollToBottomText = 'Scroll to bottom';

const ScrollPerformance = () => {
  const [isOpen, setIsOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const scrollToBottom = () =>
    bottomRef.current && bottomRef.current.scrollIntoView(true);

  return (
    <>
      <button data-testid="open" onClick={open}>
        {openText}
      </button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={close} testId="modal">
            <ModalHeader>
              <ModalTitle>Modal dialog</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Lorem count={10} />
              <div ref={bottomRef} />
            </ModalBody>
            <ModalFooter>
              <Button testId="close" appearance="primary" onClick={close}>
                {closeText}
              </Button>
              <Button
                testId="scroll-to-bottom"
                appearance="subtle"
                onClick={scrollToBottom}
              >
                {scrollToBottomText}
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Scroll to bottom',
    description: 'Opens the modal dialog',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const openButton = await findByText(container, openText);
      fireEvent.click(openButton);

      const content = await findByTestId(document.body, 'modal--scrollable');

      await controls.time(async () => {
        content.scrollTo(0, content.scrollHeight);
      });
    },
  },
];

ScrollPerformance.story = {
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default ScrollPerformance;
