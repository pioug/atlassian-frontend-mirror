import React from 'react';

import Spinner from '@atlaskit/spinner';
import { N100 } from '@atlaskit/theme/colors';

import Tabs, { Tab, TabList, TabPanel } from '../src';

export default function withFlexContent() {
  return (
    <div
      style={{
        height: 200,
        margin: '16px auto',
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        border: `1px dashed ${N100}`,
        display: 'flex',
      }}
    >
      <Tabs id="with-flex">
        <TabList>
          <Tab>Spinner should be centered</Tab>
        </TabList>
        <TabPanel>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: '1 0 auto',
              justifyContent: 'center',
            }}
          >
            <Spinner size="medium" />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
