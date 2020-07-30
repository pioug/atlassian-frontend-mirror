import React from 'react';

import styled from 'styled-components';

import { DN10, N20, subtleText } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import Tooltip from '@atlaskit/tooltip';

import Tabs, { TabItem } from '../../src';
import { TabItemComponentProvided } from '../../src/types';

export const StyledContent = styled.div`
  align-items: center;
  background-color: ${themed({ light: N20, dark: DN10 })};
  border-radius: ${borderRadius}px;
  color: ${subtleText};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 4em;
  font-weight: 500;
  justify-content: center;
  margin-bottom: ${gridSize}px;
  margin-top: ${multiply(gridSize, 2)}px;
  padding: ${multiply(gridSize, 4)}px;
`;

export const tabs = [
  {
    label: 'Tab 1',
    content: <StyledContent>One</StyledContent>,
    tooltip: 'Tooltip for tab 1',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 2',
    content: <StyledContent>Two</StyledContent>,
    tooltip: 'Tooltip for tab 2',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 3',
    content: <StyledContent>Three</StyledContent>,
    tooltip: 'Tooltip for tab 3',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 4',
    content: <StyledContent>Four</StyledContent>,
    tooltip: 'Tooltip for tab 4',
    href: 'http://atlassian.design',
  },
];

/** This custom component wraps a tooltip around the tab item */
const TooltipItem = (props: TabItemComponentProvided) => (
  <Tooltip content={props.data.tooltip}>
    <TabItem {...props} />
  </Tooltip>
);

const TabItemCustomComponentExample = () => (
  <div>
    <h3>Tabs with tooltips</h3>
    <Tabs
      components={{ Item: TooltipItem }}
      onSelect={(_tab, index) => console.log('Selected Tab', index + 1)}
      tabs={tabs}
    />
  </div>
);

export default TabItemCustomComponentExample;
