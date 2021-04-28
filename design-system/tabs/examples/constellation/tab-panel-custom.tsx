/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { N20, N200 } from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import Tabs, { Tab, TabList, useTabPanel } from '../../src';

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

const CustomTabPanel = ({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) => {
  const tabPanelAttributes = useTabPanel();

  return (
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
        /* Override the padding provided in Tabs */
        && {
          padding: ${gridSize * 4}px;
        }
      `}
      {...tabPanelAttributes}
    >
      <span>{heading}</span>
      <p>{body}</p>
    </div>
  );
};

const TabPanelCustomExample = () => (
  <Tabs id="custom-panel">
    <TabList>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
    </TabList>
    <CustomTabPanel heading="One" body="Body of tab one" />
    <CustomTabPanel heading="Two" body="Body of tab two" />
    <CustomTabPanel heading="Three" body="Body of tab three" />
  </Tabs>
);

export default TabPanelCustomExample;
