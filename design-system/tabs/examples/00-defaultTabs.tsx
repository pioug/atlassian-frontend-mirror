import React from 'react';
import Tabs from '../src';
import { Content } from './shared';

const tabs = [
  { label: 'Tab 1', content: <Content>One</Content> },
  { label: 'Tab 2', content: <Content>Two</Content> },
  { label: 'Tab 3', content: <Content>Three</Content> },
  { label: 'Tab 4', content: <Content>Four</Content> },
];

export default () => (
  <Tabs
    tabs={tabs}
    onSelect={(_tab, index) => console.log('Selected Tab', index + 1)}
  />
);
