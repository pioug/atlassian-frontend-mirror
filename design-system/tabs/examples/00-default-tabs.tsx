import React from 'react';

import Tabs, { Tab, TabList, TabPanel } from '../src';

import { Panel } from './shared';

export default function defaultTabs() {
  return (
    <Tabs
      onChange={(index) => console.log('Selected Tab', index + 1)}
      id="default"
      testId="default"
    >
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
        <Tab>Tab 4</Tab>
      </TabList>
      <TabPanel>
        <Panel>One</Panel>
      </TabPanel>
      <TabPanel>
        <Panel>Two</Panel>
      </TabPanel>
      <TabPanel>
        <Panel>Three</Panel>
      </TabPanel>
      <TabPanel>
        <Panel>Four</Panel>
      </TabPanel>
    </Tabs>
  );
}
