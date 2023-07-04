/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N20, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import Tabs, { Tab, TabList, TabPanel } from '../../src';

const panelStyles = css({
  display: 'flex',
  marginTop: token('space.200', '16px'),
  marginBottom: token('space.100', '8px'),
  padding: token('space.400', '32px'),
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  backgroundColor: token('color.background.neutral', N20),
  borderRadius: token('border.radius', '3px'),
  color: token('color.text.subtlest', N200),
  fontSize: '4em',
  fontWeight: 500,
});

export const Panel = ({ children }: { children: ReactNode }) => (
  <div css={panelStyles}>{children}</div>
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
