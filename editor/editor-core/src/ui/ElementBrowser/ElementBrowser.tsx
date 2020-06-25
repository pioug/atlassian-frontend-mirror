import React, { Component } from 'react';
import StatelessElementBrowser from './StatelessElementBrowser';

import {
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
import { Modes } from './types';

interface Props {
  quickInsertProvider: Promise<QuickInsertProvider>;
  showSearch: boolean;
  showCategories: boolean;
  mode: keyof typeof Modes;
}

interface State {
  items: QuickInsertItem[];
}

export default class ElementBrowser extends Component<Props, State> {
  state: State = {
    items: [],
  };

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = async () => {
    const { quickInsertProvider } = this.props;
    const provider = await quickInsertProvider;
    const items = await provider.getItems();
    this.setState({ items });
  };
  render() {
    const { showSearch, showCategories, mode } = this.props;
    const { items } = this.state;
    return (
      <StatelessElementBrowser
        items={items}
        categories={categoriesList}
        onSearch={() => {}}
        onSelectCategory={() => {}}
        onClickItem={() => {}}
        onEnter={() => {}}
        showSearch={showSearch}
        showCategories={showCategories}
        mode={mode}
      />
    );
  }
}

const categoriesList = [
  { title: 'Formatting', name: 'formatting' },
  { title: 'Confluence content', name: 'confluence-content' },
  { title: 'Media', name: 'media' },
  { title: 'Visuals & images', name: 'visuals' },
  { title: 'Navigation', name: 'navigation' },
  { title: 'External content', name: 'external-content' },
  { title: 'Communication', name: 'communication' },
  { title: 'Reporting', name: 'reporting' },
  { title: 'Administration', name: 'admin' },
  { title: 'Development', name: 'development' },
  { title: 'Hidden', name: 'hidden-macros' },
];
