import { fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

export const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Click a menu item',
    description:
      'Recording how long a mousedown + click event take to be processed',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const menuItem: HTMLElement | null = container.querySelector(
        '[data-testid="menu-item"]',
      );
      if (menuItem == null) {
        throw new Error('Could not find a menu item element');
      }

      fireEvent.mouseDown(menuItem);
      fireEvent.click(menuItem);
    },
  },
  {
    name: 'Focus on a menu item',
    description: 'Focus on a menu item and wait for layout and paint to finish',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const menuItem: HTMLElement | null = container.querySelector(
        '[data-testid="menu-item"]',
      );
      if (menuItem == null) {
        throw new Error('Could not find a menu item element');
      }

      await controls.time(async () => {
        fireEvent.focus(menuItem);
        fireEvent.blur(menuItem);
      });
    },
  },
  {
    name: 'Select a menu item',
    description: 'Trigger the selection of a menu item',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const menuItem: HTMLElement | null = container.querySelector(
        '[data-testid="menu-item"]',
      );

      if (menuItem == null) {
        throw new Error('Could not find a menu item element');
      }

      await controls.time(async () => {
        fireEvent(menuItem, new Event('toggle-select'));
      });
    },
  },
  {
    name: 'Disable a menu item',
    description: 'Trigger the disabling of a menu item',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const menuItem: HTMLElement | null = container.querySelector(
        '[data-testid="menu-item"]',
      );
      if (menuItem == null) {
        throw new Error('Could not find a menu item element');
      }

      const beforeState =
        menuItem.getAttribute('aria-disabled') ||
        menuItem.getAttribute('disabled');

      if (beforeState === 'true') {
        throw new Error('Should not be disabled before the test begins');
      }

      await controls.time(async () => {
        fireEvent(menuItem!, new Event('toggle-disabled'));
      });

      const afterState =
        menuItem.getAttribute('aria-disabled') ||
        menuItem.getAttribute('disabled');

      if (afterState === 'false') {
        throw new Error('Should be disabled after the test finished');
      }
    },
  },
];
