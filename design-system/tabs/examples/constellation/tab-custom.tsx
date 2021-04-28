/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { N20, N200 } from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import Tabs, { TabList, TabPanel, useTab } from '../../src';

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

export const Panel = ({ children }: { children: ReactNode }) => (
  <div
    css={css`
      align-items: center;
      background-color: ${N20};
      border-radius: ${borderRadius}px;
      color: ${N200};
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      font-size: 4em;
      font-weight: 500;
      justify-content: center;
      margin-bottom: ${gridSize}px;
      margin-top: ${gridSize * 2}px;
      padding: ${gridSize * 4}px;
    `}
  >
    {children}
  </div>
);

const CustomTab = ({ label }: { label: string }) => {
  const tabAttributes = useTab();

  return (
    <div
      css={css`
        font-size: 16px;
      `}
      {...tabAttributes}
    >
      {label}
    </div>
  );
};

const TabCustomExample = () => (
  <Tabs id="custom-tabs">
    <TabList>
      <CustomTab label="Tab 1" />
      <CustomTab label="Tab 2" />
      <CustomTab label="Tab 3" />
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
  </Tabs>
);

export default TabCustomExample;
