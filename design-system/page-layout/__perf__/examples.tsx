import React from 'react';

import {
  findByTestId,
  findByText,
  fireEvent,
  getByTestId,
} from '@testing-library/dom'; // eslint-disable-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance'; // eslint-disable-line import/no-extraneous-dependencies

import ProductExample from './utils/perf-example';

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

const performance = () => {
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

export default performance;
