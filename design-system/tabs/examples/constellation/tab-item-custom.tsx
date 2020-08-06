import React from 'react';

import Tooltip from '@atlaskit/tooltip';

import Tabs, { TabItem } from '../../src';
import { TabItemComponentProvided } from '../../src/types';
import { Content } from '../shared';

export const tabs = [
  {
    label: 'Tab 1',
    content: <Content>One</Content>,
    tooltip: 'Tooltip for tab 1',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 2',
    content: <Content>Two</Content>,
    tooltip: 'Tooltip for tab 2',
    href: 'http://atlassian.design',
  },
  {
    label: 'Tab 3',
    content: <Content>Three</Content>,
    tooltip: 'Tooltip for tab 3',
    href: 'http://atlassian.design',
  },
];

const TooltipItem = (props: TabItemComponentProvided) => (
  <Tooltip content={props.data.tooltip}>
    <TabItem {...props} />
  </Tooltip>
);

const TabItemCustomComponentExample = () => (
  <Tabs components={{ Item: TooltipItem }} tabs={tabs} />
);

export default TabItemCustomComponentExample;
