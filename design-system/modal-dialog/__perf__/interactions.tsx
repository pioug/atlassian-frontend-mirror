import React, { useCallback, useState } from 'react';

import { findByText, fireEvent } from '@testing-library/dom';
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

const modalText = (index: number) => `Hello, world (${index})`;
const closeText = (index: number) => `Close (${index})`;
const openText = (index: number) => `Open (${index})`;

const InteractionPerformance = ({ index = 0 }: { index?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button data-testid="open-button" onClick={open}>
        {openText(index)}
      </button>

      <ModalTransition>
        {isOpen && (
          <Modal onClose={close}>
            <ModalHeader>
              <ModalTitle>Modal dialog</ModalTitle>
            </ModalHeader>
            <ModalBody>
              {modalText(index)}
              <InteractionPerformance index={index + 1} />
            </ModalBody>
            <ModalFooter>
              <Button testId="primary" appearance="primary" onClick={close}>
                {closeText(index)}
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
    name: 'Open first',
    description: 'Opens the modal dialog',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const openButton = await findByText(container, openText(0));

      await controls.time(async () => {
        fireEvent.click(openButton);
        await findByText(document.body, modalText(0));
      });
    },
  },
  {
    name: 'Close first',
    description: 'Closes the modal dialog',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const openButton = await findByText(container, openText(0));
      fireEvent.click(openButton);

      await controls.time(async () => {
        const closeButton = await findByText(document.body, closeText(0));
        fireEvent.click(closeButton);
      });
    },
  },
  {
    name: 'Open second',
    description: 'Opens the a second modal',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const openButton = await findByText(container, openText(0));
      fireEvent.click(openButton);
      await findByText(document.body, modalText(0));
      const secondOpenButton = await findByText(document.body, openText(1));

      await controls.time(async () => {
        fireEvent.click(secondOpenButton);
        await findByText(document.body, modalText(1));
      });
    },
  },
  {
    name: 'Close second',
    description: 'Closes the a second modal',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const openButton = await findByText(container, openText(0));
      fireEvent.click(openButton);
      await findByText(document.body, modalText(0));
      const secondOpenButton = await findByText(document.body, openText(1));
      fireEvent.click(secondOpenButton);
      await findByText(document.body, modalText(1));

      await controls.time(async () => {
        const closeButton = await findByText(document.body, closeText(1));
        fireEvent.click(closeButton);
      });
    },
  },
];

InteractionPerformance.story = {
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default InteractionPerformance;
