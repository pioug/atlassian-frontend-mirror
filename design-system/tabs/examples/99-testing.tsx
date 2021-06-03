import React from 'react';

import TabItem from '../src/components/tab';
import TabList from '../src/components/tab-list';
import TabPanel from '../src/components/tab-panel';
import Tabs from '../src/components/tabs';

import { Panel } from './shared';

export default function testing() {
  return (
    <Tabs
      onChange={(index) => {
        console.log('selected index: ', index);
      }}
      testId="tabs"
      id="testing"
    >
      <TabList>
        <TabItem testId="tab-1">Tab 1</TabItem>
        <TabItem testId="tab-2">Tab 2</TabItem>
        <TabItem testId="tab-3">Tab 3</TabItem>
        <TabItem testId="tab-4">Tab 4</TabItem>
      </TabList>
      <TabPanel testId="tab-panel-1">
        <Panel>One</Panel>
      </TabPanel>
      <TabPanel testId="tab-panel-2">
        <Panel>Two</Panel>
      </TabPanel>
      <TabPanel testId="tab-panel-3">
        <Panel>Three</Panel>
      </TabPanel>
      <TabPanel testId="tab-panel-4">
        <Panel>Four</Panel>
      </TabPanel>
    </Tabs>
  );
}
