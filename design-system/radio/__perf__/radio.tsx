/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { fireEvent } from '@testing-library/react';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import RadioGroup from '../src/RadioGroup';

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Select radio input',
    description: 'Select a radio input when nothing is selected',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const radio: HTMLElement | null = container.querySelector(
        'input[name="color"][value="red"]',
      );
      if (radio == null) {
        throw new Error('Could not find radio element');
      }
      await controls.time(async () => {
        fireEvent.click(radio);
      });
    },
  },
  {
    name: 'Hovering radio input',
    description: 'Hover over one radio input',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const radio: HTMLElement | null = container.querySelector(
        'input[name="color"][value="red"]',
      );
      if (radio == null) {
        throw new Error('Could not find radio element');
      }
      await controls.time(async () => {
        fireEvent.mouseOver(radio);
      });
    },
  },
  {
    name: 'Changing radio input',
    description: 'Select a radio input then click on another radio input',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const redRadio: HTMLElement | null = container.querySelector(
        'input[name="color"][value="red"]',
      );
      if (redRadio == null) {
        throw new Error('Could not find radio element');
      }
      const blueRadio: HTMLElement | null = container.querySelector(
        'input[name="color"][value="blue"]',
      );
      if (blueRadio == null) {
        throw new Error('Could not find radio element');
      }

      fireEvent.click(redRadio);

      await controls.time(async () => {
        fireEvent.click(blueRadio);
      });
    },
  },
];

function PerformanceComponent() {
  return (
    <RadioGroup
      options={[
        { name: 'color', value: 'red', label: 'Red' },
        { name: 'color', value: 'blue', label: 'Blue' },
        { name: 'color', value: 'yellow', label: 'Yellow' },
        { name: 'color', value: 'green', label: 'Green' },
        { name: 'color', value: 'black', label: 'Black' },
      ]}
    />
  );
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
