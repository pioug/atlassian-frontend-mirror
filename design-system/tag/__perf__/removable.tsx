import React from 'react';

import { findByText, fireEvent, getByTestId } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import RemovableTag from '../src';

const removableTag = () => (
  <RemovableTag text="removable tag" testId="test-tag" isRemovable />
);

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'RemovableTag',
    description: 'Render a tag and then remove it',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      await findByText(container, 'removable tag', undefined, {
        timeout: 2000,
      });

      const button = getByTestId(container, 'close-button-test-tag');
      fireEvent.click(button);
    },
  },
];

removableTag.story = {
  name: 'RemovableTag',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default removableTag;
