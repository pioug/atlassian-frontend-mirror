import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@testing-library/react';
import type {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Tabs, { Tab, TabList, TabPanel } from '../index';

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Change tabs',
    description: 'Change tabs',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const tab2: HTMLElement | null = container.querySelector(
        'div[data-testid="tab2"]',
      );
      if (tab2 == null) {
        throw new Error('Could not find tab element');
      }
      await controls.time(async () => {
        fireEvent.click(tab2);
      });
    },
  },
];

function PerformanceComponent() {
  return (
    <Tabs id="test">
      <TabList>
        <Tab testId="tab1">Tab 1</Tab>
        <Tab testId="tab2">Tab 2</Tab>
        <Tab>Tab 3</Tab>
        <Tab>Tab 4</Tab>
      </TabList>
      <TabPanel>One</TabPanel>
      <TabPanel>Two</TabPanel>
      <TabPanel>Three</TabPanel>
      <TabPanel>Four</TabPanel>
    </Tabs>
  );
}

export const performance = () => <PerformanceComponent />;

performance.story = {
  name: 'Performance',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

const heavyInteractionTasks: PublicInteractionTask[] = [
  {
    name: 'Change tabs twice',
    description: 'Change tabs twice',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const tab1: HTMLElement | null = container.querySelector(
        'div[data-testid="tab1"]',
      );
      const tab2: HTMLElement | null = container.querySelector(
        'div[data-testid="tab2"]',
      );
      if (tab1 === null || tab2 === null) {
        throw new Error('Could not find tab element');
      }
      fireEvent.click(tab2);
      await controls.time(async () => {
        fireEvent.click(tab1);
      });
    },
  },
];

function HeavyContent({ text }: { text: string }) {
  return (
    <div>
      {Array(100)
        .fill(undefined)
        .map(() => (
          <div>{text}</div>
        ))}
    </div>
  );
}

function HeavyPanelPerformanceComponent() {
  return (
    <Tabs id="heavy">
      <TabList>
        <Tab testId="tab1">Tab 1</Tab>
        <Tab testId="tab2">Tab 2</Tab>
        <Tab>Tab 3</Tab>
        <Tab>Tab 4</Tab>
      </TabList>
      <TabPanel>
        <HeavyContent text="One" />
      </TabPanel>
      <TabPanel>
        <HeavyContent text="Two" />
      </TabPanel>
      <TabPanel>
        <HeavyContent text="Three" />
      </TabPanel>
      <TabPanel>
        <HeavyContent text="Four" />
      </TabPanel>
    </Tabs>
  );
}

export const heavyPerformance = () => <HeavyPanelPerformanceComponent />;

heavyPerformance.story = {
  name: 'Performance with heavy panels',
  parameters: {
    performance: {
      interactions: heavyInteractionTasks,
    },
  },
};
