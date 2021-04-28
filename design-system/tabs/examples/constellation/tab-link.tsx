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

const LinkTab = ({ label, href }: { label: string; href: string }) => {
  const { onKeyDown, tabIndex, ...tabAttributes } = useTab();

  return (
    <a
      href={href}
      css={css`
        text-decoration: none;
        &:hover {
          text-decoration: none;
        }
      `}
      {...tabAttributes}
    >
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
