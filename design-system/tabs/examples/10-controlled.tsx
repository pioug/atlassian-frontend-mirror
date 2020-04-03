import React, { Component } from 'react';
import Tabs from '../src';
import { TabData } from '../src/types';
import { Content } from './shared';

interface State {
  selected: TabData;
}

const tabs = [
  { label: 'Tab 1', content: <Content>One</Content> },
  { label: 'Tab 2', content: <Content>Two</Content> },
  { label: 'Tab 3', content: <Content>Three</Content> },
  { label: 'Tab 4', content: <Content>Four</Content> },
];

export default class TabsControlledExample extends Component<{}, State> {
  state = { selected: tabs[0] };

  handleUpdate = (selected: TabData) => this.setState({ selected });

  render() {
    const { selected } = this.state;
    return (
      <div>
        <Tabs onSelect={this.handleUpdate} selected={selected} tabs={tabs} />
        <button
          disabled={selected === tabs[3]}
          onClick={() => this.handleUpdate(tabs[3])}
        >
          Select the last tab
        </button>
      </div>
    );
  }
}
