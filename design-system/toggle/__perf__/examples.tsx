import React from 'react';

import { fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Toggle from '../src';

const toggle = () => {
  return <Toggle testId="my-toggle" />;
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Change toggle status',
    description: 'Switch a toggle on and off',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const toggles = Array.from(
        container.querySelectorAll('[data-testid="my-toggle"]'),
      );
      const last = toggles[toggles.length - 1];
      fireEvent.click(last);
    },
  },
];

toggle.story = {
  name: 'Toggle',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default toggle;
