/** @jsx jsx */
import { ReactNode, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import { Box } from '@atlaskit/primitives';
import { N20, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Tabs, { Tab, TabList, TabPanel } from '../../src';
import { SelectedType } from '../../src/types';

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

export default function TabsControlledExample() {
  const [selected, setSelected] = useState(0);

  const handleUpdate = useCallback(
    (index: SelectedType) => setSelected(index),
    [setSelected],
  );

  return (
    <Box>
      <Tabs onChange={handleUpdate} selected={selected} id="controlled">
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
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
      <Button isDisabled={selected === 2} onClick={() => handleUpdate(2)}>
        Select the last tab
      </Button>
    </Box>
  );
}
