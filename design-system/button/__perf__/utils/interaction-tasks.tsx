import { fireEvent } from '@testing-library/react';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

export const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Click a button',
    description:
      'Recording how long a mousedown + click event take to be processed',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const button: HTMLElement | null = container.querySelector(
        '[data-testid="my-button"]',
      );
      if (button == null) {
        throw new Error('Could not find button element');
      }

      fireEvent.mouseDown(button);
      fireEvent.click(button);
    },
  },
  {
    name: 'Focus on button',
    description: 'Focus on a button and wait for layout and paint to finish',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const button: HTMLElement | null = container.querySelector(
        '[data-testid="my-button"]',
      );
      if (button == null) {
        throw new Error('Could not find button element');
      }

      await controls.time(async () => {
        fireEvent.focus(button);
        fireEvent.blur(button);
      });
    },
  },
  {
    name: 'Select button',
    description: 'Trigger the selection of a button',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const button: HTMLElement | null = container.querySelector(
        '[data-testid="my-button"]',
      );
      if (button == null) {
        throw new Error('Could not find button element');
      }

      if (button.getAttribute('data-is-selected') !== 'false') {
        throw new Error('Should not start selected');
      }

      await controls.time(async () => {
        fireEvent(button, new Event('toggle-select'));
      });

      if (button.getAttribute('data-is-selected') !== 'true') {
        throw new Error('Should now be selected');
      }
    },
  },
  {
    name: 'Disable button',
    description: 'Trigger the disabling of a button',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const button: HTMLElement | null = container.querySelector(
        '[data-testid="my-button"]',
      );
      if (button == null) {
        throw new Error('Could not find button element');
      }

      if (button.hasAttribute('disabled')) {
        throw new Error('Should not start disabled');
      }

      await controls.time(async () => {
        fireEvent(button, new Event('toggle-disabled'));
      });

      if (!button.hasAttribute('disabled')) {
        throw new Error('Should now be disabled');
      }
    },
  },
];
