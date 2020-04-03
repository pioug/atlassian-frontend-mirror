import React, { Component } from 'react';
import Tabs from '../src';
import { TabData, OnSelectCallback } from '../src/types';
import { Content } from './shared';

export const tabs = [
  {
    label: 'Tab 1',
    content: <Content>One</Content>,
    id: 'tab-1',
  },
  {
    label: 'Tab 2',
    content: <Content>Two</Content>,
    id: 'tab-2',
  },
  {
    label: 'Tab 3',
    content: <Content>Three</Content>,
    id: 'tab-3',
  },
  {
    label: 'Tab 4',
    content: <Content>Four</Content>,
    id: 'tab-4',
  },
];

const customIsSelectedFunction = (selected: string, tab: TabData) =>
  selected === tab.id;

class TabsWithCustomIsSelected extends Component<{}, { selected: string }> {
  state = {
    selected: 'tab-4',
  };

  onSelect: OnSelectCallback = ({ id }) => this.setState({ selected: id });

  render() {
    return (
      <Tabs
        tabs={tabs}
        selected={this.state.selected}
        isSelectedTest={customIsSelectedFunction}
        onSelect={this.onSelect}
      />
    );
  }
}

export default () => (
  <div>
    <h3>Determine selected tab by tab object equality (built-in)</h3>
    <Tabs tabs={tabs} defaultSelected={tabs[1]} />
    <h3>Determine selected tab by tab index equality (in-built)</h3>
    <Tabs tabs={tabs} defaultSelected={2} />
    <h3>With a custom isSelectedTest function</h3>
    <TabsWithCustomIsSelected />
  </div>
);
