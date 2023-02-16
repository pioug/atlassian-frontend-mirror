import React from 'react';

import Lorem from 'react-lorem-component';

import { N100 } from '@atlaskit/theme/colors';

import Tabs, { Tab, TabList, TabPanel } from '../src';

export default () => (
  <div
    style={{
      height: 200,
      margin: '16px auto',
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      border: `1px dashed ${N100}`,
      display: 'flex',
    }}
  >
    <Tabs id="overflow">
      <TabList>
        <Tab>Constrained height scrolls</Tab>
        <Tab>Unconstrained height</Tab>
      </TabList>
      <TabPanel>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexBasis: '100%',
            overflowY: 'scroll',
          }}
        >
          <p
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: '0 0 auto',
            }}
          >
            This paragraph is testing horizontal overflow to make sure that the
            scroll container stays where it should be.
          </p>
          <Lorem count={5} />
        </div>
      </TabPanel>
      <TabPanel>
        <div>
          <Lorem count={5} />
        </div>
      </TabPanel>
    </Tabs>
  </div>
);
