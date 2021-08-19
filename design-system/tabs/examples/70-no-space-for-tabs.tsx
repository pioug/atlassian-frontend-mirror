import React from 'react';

import { N100 } from '@atlaskit/theme/colors';

import Tabs, { Tab, TabList, TabPanel } from '../src';

import { Panel } from './shared';

export default function noSpaceForTabs() {
  return (
    <div
      style={{
        width: 400,
        height: 200,
        margin: '16px auto',
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        border: `1px dashed ${N100}`,
        display: 'flex',
      }}
    >
      <Tabs id="no-space-for-tabs">
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
