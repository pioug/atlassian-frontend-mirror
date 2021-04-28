import React from 'react';

import { fireEvent } from '@testing-library/react';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import { Checkbox } from '../src';

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Select checkbox',
    description: 'Select checkbox',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const checkbox: HTMLElement | null = container.querySelector(
        'input[name="checkbox-basic"]',
      );
      if (checkbox == null) {
        throw new Error('Could not find checkbox element');
      }
      await controls.time(async () => {
        fireEvent.click(checkbox);
      });
    },
  },
  {
    name: 'Hover checkbox',
    description: 'Hover checkbox',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const checkbox: HTMLElement | null = container.querySelector(
        'input[name="checkbox-basic"]',
      );
      if (checkbox == null) {
        throw new Error('Could not find checkbox element');
      }
      await controls.time(async () => {
        fireEvent.mouseOver(checkbox);
      });
    },
  },
  {
    name: 'Focus checkbox',
    description: 'Focus checkbox',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const checkbox: HTMLElement | null = container.querySelector(
        'input[name="checkbox-basic"]',
      );
      if (checkbox == null) {
        throw new Error('Could not find checkbox element');
      }
      await controls.time(async () => {
        fireEvent.focus(checkbox);
      });
    },
  },
];

function PerformanceComponent() {
  return (
    <Checkbox
      value="Basic checkbox"
      label="Basic checkbox"
      name="checkbox-basic"
      testId="cb-basic"
    />
  );
}

PerformanceComponent.story = {
  name: 'Performance',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default PerformanceComponent;
