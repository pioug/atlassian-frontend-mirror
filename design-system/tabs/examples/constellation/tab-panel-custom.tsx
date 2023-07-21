/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { Box } from '@atlaskit/primitives';
import { N20, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Tabs, { Tab, TabList, useTabPanel } from '../../src';

const customPanelStyles = css({
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
  /* Override the padding provided in Tabs */
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '&&': {
    padding: token('space.400', '32px'),
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
      <Box as="span">{heading}</Box>
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
