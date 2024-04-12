/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

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
  font: token('font.heading.xxlarge'),
  marginBlockEnd: token('space.100', '8px'),
  marginBlockStart: token('space.200', '16px'),
});

export const Panel = ({ children }: { children: ReactNode }) => (
  <div css={panelStyles}>{children}</div>
);

const lintTabStyles = css({
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
});
const LinkTab = ({ label, href }: { label: string; href: string }) => {
  const { onKeyDown, tabIndex, ...tabAttributes } = useTab();

  return (
    <a href={href} css={lintTabStyles} {...tabAttributes}>
      {label}
    </a>
  );
};

const href = 'http://atlassian.design';

const TabLinkExample = () => (
  <Tabs id="link-tabs">
    <TabList>
      <LinkTab label="Tab 1" href={href} />
      <LinkTab label="Tab 2" href={href} />
      <LinkTab label="Tab 3" href={href} />
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

export default TabLinkExample;
