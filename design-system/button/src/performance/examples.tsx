import React, { useLayoutEffect, useRef, useState } from 'react';

import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Button, { ButtonProps, CustomThemeButton } from '../index';

// eslint-disable-next-line
import { fireEvent } from '@testing-library/react';

function Example({ Component }: { Component: ButtonProps['component'] }) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    function toggleSelect() {
      setIsSelected(value => !value);
    }
    function toggleDisabled() {
      setIsDisabled(value => !value);
    }

    const el: HTMLElement | null = ref.current;
    if (!el) {
      throw new Error('Could not find button ref');
    }

    el.addEventListener('toggle-select', toggleSelect);
    el.addEventListener('toggle-disabled', toggleDisabled);

    return () => {
      el.removeEventListener('toggle-select', toggleSelect);
      el.removeEventListener('toggle-disabled', toggleDisabled);
    };
  }, []);

  return (
    // @ts-ignore
    <Component
      ref={ref}
      testId="my-button"
      isSelected={isSelected}
      isDisabled={isDisabled}
      data-is-selected={isSelected}
    >
      Hello world
    </Component>
  );
}

const interactionTasks: PublicInteractionTask[] = [
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

export const button = () => <Example Component={Button} />;

button.story = {
  name: 'Button',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export const customThemeButton = () => (
  <Example Component={CustomThemeButton} />
);

customThemeButton.story = {
  name: 'CustomThemeButton',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};
