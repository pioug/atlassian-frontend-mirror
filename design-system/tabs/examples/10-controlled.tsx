import React, { useState } from 'react';

import Tabs, { Tab, TabList, TabPanel } from '../src';
import { SelectedType } from '../src/types';

import { Panel } from './shared';

export default function TabsControlledExample() {
  const [selected, setSelected] = useState(0);

  const handleUpdate = (index: SelectedType) => setSelected(index);

  return (
    <div>
      <Tabs onChange={handleUpdate} selected={selected} id="controlled">
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
      <button disabled={selected === 3} onClick={() => handleUpdate(3)}>
        Select the last tab
      </button>
    </div>
  );
}
