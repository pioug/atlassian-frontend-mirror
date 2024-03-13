/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Tabs, { TabList, TabPanel, useTab } from '../../src';

const panelStyles = css({
  display: 'flex',
  padding: token('space.400', '32px'),
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  backgroundColor: token('color.background.neutral'),
  borderRadius: token('border.radius', '3px'),
  color: token('color.text.subtlest'),
  fontSize: '4em',
  fontWeight: 500,
  marginBlockEnd: token('space.100', '8px'),
  marginBlockStart: token('space.200', '16px'),
});

export const Panel = ({ children }: { children: ReactNode }) => (
  <div css={panelStyles}>{children}</div>
);

const customTabStyles = xcss({
  fontSize: '16px',
});

const CustomTab = ({ label }: { label: string }) => {
  const tabAttributes = useTab();

  return (
    <Box xcss={customTabStyles} {...tabAttributes}>
      {label}
    </Box>
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
      <Panel>This is the content area of the first tab.</Panel>
    </TabPanel>
    <TabPanel>
      <Panel>This is the content area of the second tab.</Panel>
    </TabPanel>
    <TabPanel>
      <Panel>This is the content area of the third tab.</Panel>
    </TabPanel>
  </Tabs>
);

export default TabCustomExample;
