import React from 'react';

import { fireEvent } from '@testing-library/react';
import type {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Range from '../src';

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Changing input value',
    description: 'Change the input value of a range with 500 steps',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const range: HTMLElement | null = container.querySelector(
        '[data-testid="my-range"]',
      );
      if (range == null) {
        throw new Error('Could not find range element');
      }
      for (let i = 251; i < 300; i++) {
        fireEvent.change(range, { target: { value: i } });
      }
    },
  },
];

function PerformanceComponent() {
  return <Range defaultValue={250} min={0} max={500} testId="my-range" />;
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
