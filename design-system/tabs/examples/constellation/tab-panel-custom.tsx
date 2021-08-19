/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { N20, N200 } from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import Tabs, { Tab, TabList, useTabPanel } from '../../src';

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

const customPanelStyles = css({
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
  /* Override the padding provided in Tabs */
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '&&': {
    padding: `${gridSize * 4}px`,
  },
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
    <div css={customPanelStyles} {...tabPanelAttributes}>
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
