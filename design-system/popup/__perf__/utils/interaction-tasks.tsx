import { findByTestId, fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

export const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Click the trigger',
    description: 'Recording how long a click event take to be processed',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const popup: HTMLElement | null = container.querySelector(
        '[data-testid="popup-trigger"]',
      );
      if (popup == null) {
        throw new Error('Could not find popup element');
      }

      await controls.time(async () => {
        // fireEvent.mouseDown(popup);
        fireEvent.click(popup);
      });
    },
  },
  {
    name: 'Open Popup',
    description: 'Recording how long the popup takes to appear',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const popup: HTMLElement | null = container.querySelector(
        '[data-testid="popup-trigger"]',
      );
      if (popup == null) {
        throw new Error('Could not find popup element');
      }
      const parent: HTMLElement | null = container.parentElement;
      if (parent == null) {
        throw new Error('Could not find parent element');
      }
      const existingPopup = parent.querySelector('[data-testid="popup"]');
      if (existingPopup != null) {
        throw new Error('Unexpected popup found');
      }

      await controls.time(async () => {
        fireEvent.click(popup);

        await findByTestId(parent, 'popup');
      });
    },
  },
];
