/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N20, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Tabs, { TabList, TabPanel, useTab } from '../../src';

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

export default TabLinkExample;
