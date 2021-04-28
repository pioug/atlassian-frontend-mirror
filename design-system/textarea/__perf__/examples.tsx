import React from 'react';

import { fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Textarea from '../src';

const testId = 'text-area-test-id';

const getLastTextArea = (container: HTMLElement) => {
  const textAreas = container.querySelectorAll(`[data-testId="${testId}"]`);
  return textAreas[textAreas.length - 1];
};

const textArea = () => {
  return <Textarea placeholder="example textarea" testId={testId} />;
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Focus',
    description: 'Render textarea and make input focus',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const textArea = getLastTextArea(container);
      fireEvent.focus(textArea);
    },
  },
  {
    name: 'Blur',
    description: 'Render textarea and make input blur',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const textArea = getLastTextArea(container);
      fireEvent.blur(textArea);
    },
  },
  {
    name: 'OnChange',
    description: 'Render textarea and make input change',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const textArea = getLastTextArea(container);
      fireEvent.change(textArea, { target: { value: 'foo' } });
    },
  },
];

textArea.story = {
  name: 'TextArea',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default textArea;
