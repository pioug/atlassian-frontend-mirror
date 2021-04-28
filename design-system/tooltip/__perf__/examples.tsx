import React, { useLayoutEffect } from 'react';

import { findByTestId, fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Tooltip from '../src';

function Child() {
  return <div id="tooltip-reference">New tooltip</div>;
}

function DefaultTooltip() {
  useLayoutEffect(() => {}, []);
  return (
    <Tooltip delay={0} content="Hello World" testId="tooltip">
      <Child />
    </Tooltip>
  );
}

const tooltip = () => <DefaultTooltip />;

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Display tooltip',
    description: 'Hover over div and wait for tooltip to load',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const element: HTMLElement | null = container.querySelector(
        '#tooltip-reference',
      );
      if (!element) {
        throw new Error('no div found');
      }
      const parent: HTMLElement | null = container.parentElement;
      if (parent == null) {
        throw new Error('Could not find parent element');
      }
      const tooltip = parent.querySelector('[data-testid="tooltip"]');
      if (tooltip != null) {
        throw new Error('Unexpected tooltip found');
      }

      await controls.time(async () => {
        fireEvent.mouseOver(element);

        await findByTestId(parent, 'tooltip');
      });
    },
  },
];

tooltip.story = {
  name: 'Default Tooltip',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default tooltip;
