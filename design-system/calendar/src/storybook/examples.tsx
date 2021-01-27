import React from 'react';

import { fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Calendar from '../index';

export default {
  title: 'Calendar',
};

const testId = 'calendar-test-id';

const getLastElement = (
  container: HTMLElement,
  testIdAttributeValue: string,
) => {
  const elements = container.querySelectorAll(
    `[data-testId="${testIdAttributeValue}"]`,
  );
  return elements[elements.length - 1];
};

export const CalendarPerformance = () => {
  return (
    <Calendar
      defaultDisabled={['2020-12-04']}
      defaultPreviouslySelected={['2020-12-06']}
      defaultSelected={['2020-12-18']}
      defaultMonth={12}
      defaultYear={2020}
      testId={testId}
    />
  );
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'onFocus',
    description: 'Render calendar and focus on it',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const calendarContainer = getLastElement(
        container,
        `${testId}--container`,
      );
      fireEvent.focus(calendarContainer);
    },
  },
  {
    name: 'onBlur',
    description: 'Render calendar and remove focus',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const calendarContainer = getLastElement(
        container,
        `${testId}--container`,
      );
      fireEvent.focus(calendarContainer);
      fireEvent.blur(calendarContainer);
    },
  },
  {
    name: 'onChange',
    description: 'Render calendar and change month',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const nextMonthButton = getLastElement(
        container,
        `${testId}--next-month`,
      );
      fireEvent.click(nextMonthButton);
    },
  },
  {
    name: 'onSelect',
    description: 'Render calendar and click on day(date) cell',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const dateCell = getLastElement(container, `${testId}--selected-day`);
      fireEvent.click(dateCell);
    },
  },
];

CalendarPerformance.story = {
  name: 'calendar',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};
