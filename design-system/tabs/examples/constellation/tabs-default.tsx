import React from 'react';

import Tabs from '../../src';
import { Content } from '../shared';

const tabs = [
  { label: 'Tab 1', content: <Content>One</Content> },
  { label: 'Tab 2', content: <Content>Two</Content> },
  { label: 'Tab 3', content: <Content>Three</Content> },
];

const TabsDefaultExample = () => <Tabs tabs={tabs} />;

export default TabsDefaultExample;
