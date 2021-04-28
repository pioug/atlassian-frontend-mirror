/** @jsx jsx */
import { ReactNode, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button';
import { N20, N200 } from '@atlaskit/theme/colors';
import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';

import Tabs, { Tab, TabList, TabPanel } from '../../src';
import { SelectedType } from '../../src/types';

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

export const Panel = ({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}) => (
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
    data-testid={testId}
  >
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
    <div>
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
    </div>
  );
}
