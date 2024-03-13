import React from 'react';

import { token } from '@atlaskit/tokens';

import Tabs, { Tab, TabList, TabPanel } from '../src';

import { Panel } from './shared';

export default function noSpaceForTabs() {
  return (
    <div
      style={{
        width: 400,
        height: 200,
        margin: `${token('space.200', '16px')} auto`,
        border: `1px dashed ${token('color.border')}`,
        display: 'flex',
      }}
    >
      <Tabs id="no-space-for-tabs" testId="no-space-for-tabs">
        <TabList>
          <Tab>Here is an incredibly super long label, too long really</Tab>
          <Tab>here, a short label</Tab>
        </TabList>
        <TabPanel>
          <Panel>Panel is here</Panel>
        </TabPanel>
        <TabPanel>
          <Panel>Panel is here</Panel>
        </TabPanel>
      </Tabs>
    </div>
  );
}
