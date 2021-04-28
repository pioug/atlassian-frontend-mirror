import React, { useCallback, useRef, useState } from 'react';

import { findByTestId, findByText, fireEvent } from '@testing-library/dom';
import Lorem from 'react-lorem-component';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Modal, { ModalTransition } from '../src';

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
          <Modal
            onClose={close}
            heading="Modal dialog"
            testId="modal"
            actions={[
              {
                text: closeText,
                onClick: close,
                testId: 'close',
              },
              {
                text: scrollToBottomText,
                onClick: scrollToBottom,
                testId: 'scroll-to-bottom',
              },
            ]}
          >
            <Lorem count={10} />
            <div ref={bottomRef} />
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

      const content = await findByTestId(
        document.body,
        'modal-dialog-content--scrollable',
      );

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
