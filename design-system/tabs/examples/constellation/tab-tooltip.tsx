/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { N20, N200 } from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import Tooltip from '@atlaskit/tooltip';

import Tabs, { Tab, TabList, TabPanel } from '../../src';

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

const TooltipTab = ({ label, tooltip }: { label: string; tooltip: string }) => (
  <Tooltip content={tooltip}>
    <Tab>{label}</Tab>
  </Tooltip>
);

const TabTooltipExample = () => (
  <Tabs id="tooltip-tabs">
    <TabList>
      <TooltipTab label="Tab 1" tooltip="Tooltip for tab 1" />
      <TooltipTab label="Tab 2" tooltip="Tooltip for tab 2" />
      <TooltipTab label="Tab 3" tooltip="Tooltip for tab 3" />
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

export default TabTooltipExample;
