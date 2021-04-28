/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { N20, N200 } from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import Tabs, { Tab, TabList, TabPanel } from '../../src';

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

export const Panel = ({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}) => (
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
    data-testid={testId}
  >
    {children}
  </div>
);

export default function TabsDefaultExample() {
  return (
    <Tabs
      onChange={index => console.log('Selected Tab', index + 1)}
      id="default"
    >
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
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
}
