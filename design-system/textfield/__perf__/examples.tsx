import React from 'react';

import { fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Texfield from '../src';

const testId = 'text-field-test-id';

const getLastTexfield = (container: HTMLElement) => {
  const textField = container.querySelectorAll(`[data-testId="${testId}"]`);
  return textField[textField.length - 1];
};

const textField = () => {
  return <Texfield placeholder="new texfield" testId={testId} width="large" />;
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Focus',
    description: 'Render texfield and make input focus',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const texfield = getLastTexfield(container);
      fireEvent.focus(texfield);
    },
  },
  {
    name: 'Blur',
    description: 'Render texfield and make input blur',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const texfield = getLastTexfield(container);
      fireEvent.blur(texfield);
    },
  },
  {
    name: 'OnChange',
    description: 'Render texfield and make input change',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const texfield = getLastTexfield(container);
      fireEvent.change(texfield, { target: { value: 'foo' } });
    },
  },
];

textField.story = {
  name: 'texfield',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default textField;
