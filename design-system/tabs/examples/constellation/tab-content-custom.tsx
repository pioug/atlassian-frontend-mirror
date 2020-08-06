import React from 'react';

import Tabs from '../../src';
import { TabContentComponentProvided } from '../../src/types';
import { Content } from '../shared';

export const tabs = [
  {
    label: 'Tab 1',
    heading: 'One',
    body: 'Body of tab one',
  },
  {
    label: 'Tab 2',
    heading: 'Two',
    body: 'Body of tab two',
  },
  {
    label: 'Tab 3',
    heading: 'Three',
    body: 'Body of tab three',
  },
];

const CustomContent = ({ data, elementProps }: TabContentComponentProvided) => (
  <Content {...elementProps}>
    <span>{data.heading}</span>
    <p>{data.body}</p>
  </Content>
);

const TabContentCustomComponentExample = () => (
  <Tabs components={{ Content: CustomContent }} tabs={tabs} />
);

export default TabContentCustomComponentExample;
