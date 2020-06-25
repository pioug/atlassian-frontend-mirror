import React from 'react';

import ProductExample from './perf-example';

import {
  findByTestId,
  findByText,
  fireEvent,
  getByTestId,
} from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

export default {
  title: 'Examples',
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Side nav: Opening nested side nav',
    description: 'Open a nested item in side-navigation',

    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const element: HTMLElement | null = getByTestId(
        container,
        'nav-side-queues--item',
      );
      fireEvent.click(element);
      await findByText(container, 'Untriaged', undefined, { timeout: 2000 });
    },
  },
  {
    name: 'Global nav: Open dropdown',
    description: 'Open a dropdown in side-navigation',

    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const element: HTMLElement | null = getByTestId(container, 'nav-help');
      fireEvent.click(element);
      await findByTestId(
        container.parentElement || container,
        'nav-help-content',
        undefined,
        {
          timeout: 2000,
        },
      );
    },
  },
  {
    name: 'Global nav: Notifications',
    description: 'Open the notifications panel in global navigation',

    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const element: HTMLElement | null = getByTestId(
        container,
        'nav-notifications',
      );
      fireEvent.click(element);
      await findByTestId(
        container.parentElement || container,
        'jira-notifications',
        undefined,
        {
          timeout: 2000,
        },
      );
    },
  },
];

export const performance = () => {
  return (
    <div style={{ margin: '-1rem 0 0 -1rem', height: '100vh' }}>
      <ProductExample />
    </div>
  );
};

performance.story = {
  name: 'Performance',

  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};
