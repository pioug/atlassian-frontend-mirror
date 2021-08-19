/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Tooltip from '@atlaskit/tooltip';

import Tabs, { Tab, TabList, TabPanel, useTab } from '../src';

import { Panel } from './shared';

/** This custom component wraps a tooltip around the tab item */
const TooltipTab = ({ label, tooltip }: { label: string; tooltip: string }) => (
  <Tooltip content={tooltip}>
    <Tab>{label}</Tab>
  </Tooltip>
);

const lintTabStyles = css({
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
});
/** This custom component makes the tab items function like regular links */
const LinkTab = ({ label, href }: { label: string; href: string }) => {
  // We also remove the onKeyDown handler and tabIndex attribute
  // from elementProps to opt out of default keyboard navigation
  const { onKeyDown, tabIndex, ...tabAttributes } = useTab();

  return (
    <a href={href} css={lintTabStyles} {...tabAttributes}>
      {label}
    </a>
  );
};

const href = 'http://atlassian.design';

const CustomTabComponent = () => (
  <div>
    <h3>Tabs with tooltips</h3>
    <Tabs
      onChange={(index) => console.log('Selected Tab', index + 1)}
      id="tooltip-tabs"
    >
      <TabList>
        <TooltipTab label="Tab 1" tooltip="Tooltip for tab 1" />
        <TooltipTab label="Tab 2" tooltip="Tooltip for tab 2" />
        <TooltipTab label="Tab 3" tooltip="Tooltip for tab 3" />
        <TooltipTab label="Tab 4" tooltip="Tooltip for tab 4" />
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
      <TabPanel>
        <Panel>Four</Panel>
      </TabPanel>
    </Tabs>
    <h3>Tabs as links</h3>
    <Tabs id="link-tabs">
      <TabList>
        <LinkTab label="Tab 1" href={href} />
        <LinkTab label="Tab 2" href={href} />
        <LinkTab label="Tab 3" href={href} />
        <LinkTab label="Tab 4" href={href} />
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
      <TabPanel>
        <Panel>Four</Panel>
      </TabPanel>
    </Tabs>
  </div>
);

export default CustomTabComponent;
