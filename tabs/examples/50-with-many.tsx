import React from 'react';
import Tabs from '../src';
import { Content } from './shared';
import { OnSelectCallback } from '../src/types';

const handleTabSelect: OnSelectCallback = (_tab, index) => {
  console.info(`Switched to tab at index ${index}`);
};

export default () => (
  <Tabs
    onSelect={handleTabSelect}
    tabs={[
      { label: 'Tab 1', content: <Content>Tab 1 content</Content> },
      { label: 'Tab 2', content: <Content>Tab 2 content</Content> },
      { label: 'Tab 3', content: <Content>Tab 3 content</Content> },
      { label: 'Tab 4', content: <Content>Tab 4 content</Content> },
      { label: 'Tab 5', content: <Content>Tab 5 content</Content> },
      { label: 'Tab 6', content: <Content>Tab 6 content</Content> },
      { label: 'Tab 7', content: <Content>Tab 7 content</Content> },
      { label: 'Tab 8', content: <Content>Tab 8 content</Content> },
      { label: 'Tab 9', content: <Content>Tab 9 content</Content> },
      { label: 'Tab 10', content: <Content>Tab 10 content</Content> },
    ]}
  />
);
