/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Tabs, { Tab, TabList, useTabPanel } from '../src';

const customPanelStyles = css({
  padding: '20px',
});

const CustomTabPanel = ({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) => {
  const tabPanelAttributes = useTabPanel();

  return (
    <span css={customPanelStyles} {...tabPanelAttributes}>
      <h3>{heading}</h3>
      <p>{body}</p>
    </span>
  );
};

const CustomTabPanels = () => (
  <Tabs
    onChange={(index) => console.log('Selected Tab', index + 1)}
    id="custom-panel"
  >
    <TabList>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
      <Tab>Tab 4</Tab>
    </TabList>
    <CustomTabPanel heading="Tab One" body="This is tab one." />
    <CustomTabPanel heading="Tab Two" body="This is tab two." />
    <CustomTabPanel heading="Tab Three" body="This is tab three." />
    <CustomTabPanel heading="Tab Four" body="This is tab four." />
  </Tabs>
);

export default CustomTabPanels;
