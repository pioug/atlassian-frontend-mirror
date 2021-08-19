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
