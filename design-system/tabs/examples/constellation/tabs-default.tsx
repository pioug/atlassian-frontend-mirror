/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N20, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Tabs, { Tab, TabList, TabPanel } from '../../src';

const panelStyles = css({
  display: 'flex',
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
  marginBlockEnd: token('space.100', '8px'),
  marginBlockStart: token('space.200', '16px'),
});

export const Panel = ({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}) => (
  <div css={panelStyles} data-testid={testId}>
    {children}
  </div>
);

export default function TabsDefaultExample() {
  return (
    <Tabs
      onChange={(index) => console.log('Selected Tab', index + 1)}
      id="default"
    >
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
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
}
