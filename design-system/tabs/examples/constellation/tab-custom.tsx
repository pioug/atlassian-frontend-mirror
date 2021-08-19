/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { N20, N200 } from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import Tabs, { TabList, TabPanel, useTab } from '../../src';

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

const panelStyles = css({
  display: 'flex',
  marginTop: `${gridSize * 2}px`,
  marginBottom: `${gridSize}px`,
  padding: `${gridSize * 4}px`,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  backgroundColor: token('color.background.subtleNeutral.resting', N20),
  borderRadius: `${borderRadius}px`,
  color: token('color.text.lowEmphasis', N200),
  fontSize: '4em',
  fontWeight: 500,
});

export const Panel = ({ children }: { children: ReactNode }) => (
  <div css={panelStyles}>{children}</div>
);

const customTabStyles = css({
  fontSize: '16px',
});

const CustomTab = ({ label }: { label: string }) => {
  const tabAttributes = useTab();

  return (
    <div css={customTabStyles} {...tabAttributes}>
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
