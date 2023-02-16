import React from 'react';

import Tabs, { Tab, TabList, TabPanel } from '../src';

export default () => (
  <Tabs id="test">
    <TabList>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
    </TabList>
    <TabPanel>
      <div>One</div>
    </TabPanel>
    <TabPanel>
      <div>Two</div>
    </TabPanel>
    <TabPanel>
      <div>Three</div>
    </TabPanel>
  </Tabs>
);
