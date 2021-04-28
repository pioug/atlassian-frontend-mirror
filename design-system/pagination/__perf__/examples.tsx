import React from 'react';

import { findByText, fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';
import invariant from 'tiny-invariant';

import Pagination from '../src';

const getPageElement = (
  container: HTMLElement,
  textContent: string,
): HTMLButtonElement | undefined =>
  Array.from(container.querySelectorAll('button')).find(
    (buttonElement: HTMLButtonElement) =>
      buttonElement.textContent?.trim() === textContent,
  );

const PaginationPerformance = () => {
  return <Pagination pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />;
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'onChange (when ellipsis changes)',
    description: 'Render pagination and change page along with ellipsis',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const lastPageElement = getPageElement(container, '10');

      invariant(lastPageElement);

      await controls.time(async () => {
        fireEvent.click(lastPageElement!);

        await findByText(container, '9', undefined, { timeout: 20000 });
      });
    },
  },
  {
    name: `onChange (when ellipsis don't change)`,
    description: 'Render pagination and change page',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const secondPageElement = getPageElement(container, '2');

      invariant(secondPageElement);

      await controls.time(async () => {
        fireEvent.click(secondPageElement!);
      });
    },
  },
];

PaginationPerformance.story = {
  name: 'pagination',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default PaginationPerformance;
