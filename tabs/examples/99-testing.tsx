import React from 'react';
import Tabs from '../src';
import { Content } from './shared';

const tabs = [
  { label: 'Tab 1', content: <Content>One</Content>, testId: 'tab-1' },
  { label: 'Tab 2', content: <Content>Two</Content>, testId: 'tab-2' },
  { label: 'Tab 3', content: <Content>Three</Content>, testId: 'tab-3' },
  { label: 'Tab 4', content: <Content>Four</Content>, testId: 'tab-4' },
];

export default () => (
  <Tabs
    tabs={tabs}
    onSelect={(_tab, index) => console.log('Selected Tab', index + 1)}
    testId="the-tabs"
  />
);
