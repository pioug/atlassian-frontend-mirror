import React from 'react';

import Tabs, { Tab, TabList, TabPanel } from '../src';
import { OnChangeCallback } from '../src/types';

import { Panel } from './shared';

const handleTabSelect: OnChangeCallback = (index) => {
  console.info(`Switched to tab at index ${index}`);
};

const tabs = [
  { label: 'Tab 1', panel: <Panel>Tab 1 panel</Panel> },
  { label: 'Tab 2', panel: <Panel>Tab 2 panel</Panel> },
  { label: 'Tab 3', panel: <Panel>Tab 3 panel</Panel> },
  { label: 'Tab 4', panel: <Panel>Tab 4 panel</Panel> },
  { label: 'Tab 5', panel: <Panel>Tab 5 panel</Panel> },
  { label: 'Tab 6', panel: <Panel>Tab 6 panel</Panel> },
  { label: 'Tab 7', panel: <Panel>Tab 7 panel</Panel> },
  { label: 'Tab 8', panel: <Panel>Tab 8 panel</Panel> },
  { label: 'Tab 9', panel: <Panel>Tab 9 panel</Panel> },
  { label: 'Tab 10', panel: <Panel>Tab 10 panel</Panel> },
];

export default function manyTabs() {
  return (
    <Tabs onChange={handleTabSelect} id="with-many">
      <TabList>
        {tabs.map((tab, index) => (
          <Tab key={index}>{tab.label}</Tab>
        ))}
      </TabList>
      {tabs.map((tab, index) => (
        <TabPanel key={index}>{tab.panel}</TabPanel>
      ))}
    </Tabs>
  );
}
