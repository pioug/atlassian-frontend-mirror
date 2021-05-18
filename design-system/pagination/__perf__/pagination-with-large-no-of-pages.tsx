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
const pages1000 = new Array(1000).fill(0).map((p, index) => index + 1 + p);
const PaginationPerformanceWith1000Pages = () => {
  return <Pagination pages={pages1000} />;
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'onChange (when ellipsis changes)',
    description: 'Render pagination and change page along with ellipsis',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const lastPageElement = getPageElement(container, '1000');

      invariant(lastPageElement);

      await controls.time(async () => {
        fireEvent.click(lastPageElement!);

        await findByText(container, '999', undefined, { timeout: 20000 });
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

PaginationPerformanceWith1000Pages.story = {
  name: 'paginationWithLargeNumberOfPages',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default PaginationPerformanceWith1000Pages;
