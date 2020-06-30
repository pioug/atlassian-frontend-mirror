import React, { Component } from 'react';
import {
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
import { find } from '../../plugins/quick-insert/search';
import StatelessElementBrowser from './StatelessElementBrowser';
import { Category, Modes } from './types';

interface Props {
  categories: Category[];
  mode: keyof typeof Modes;
  quickInsertProvider: Promise<QuickInsertProvider>;
  onSelectItem: (item: QuickInsertItem) => void;
  search: (
    searchTerm: string,
    items: QuickInsertItem[],
    category?: string,
  ) => QuickInsertItem[];
  showSearch: boolean;
  showCategories: boolean;
  defaultCategory?: string;
}

interface State {
  allItems: QuickInsertItem[];
  items: QuickInsertItem[];
  selectedCategory?: string;
}

export default class ElementBrowser extends Component<Props, State> {
  static defaultProps = {
    search: find,
  };

  state: State = {
    allItems: [],
    items: [],
    selectedCategory: this.props.defaultCategory,
  };

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = async () => {
    const { quickInsertProvider } = this.props;
    const provider = await quickInsertProvider;
    const items = await provider.getItems();
    this.setState({ allItems: items, items });
  };

  getFilteredItemsForCategory = (
    items: QuickInsertItem[],
    selected: Category,
  ): QuickInsertItem[] => {
    return selected.name === 'all'
      ? items
      : items.filter(
          (item: QuickInsertItem) => item.category === selected.name,
        );
  };

  handleSearch = (searchTerm: string) => {
    const { selectedCategory, allItems } = this.state;
    const filteredItems = this.props.search(
      searchTerm,
      allItems,
      selectedCategory,
    );
    this.setState({ items: filteredItems });
  };

  resetCategorySelection = (state: State, { defaultCategory }: Props) => ({
    ...state,
    selectedCategory: defaultCategory,
    items: state.allItems,
  });

  handleCategorySelection = (clickedCategory: Category) => {
    const { allItems, selectedCategory: stateCategoryValue } = this.state;

    /**
     * Reset selection if clicked on the same category twice.
     */
    if (stateCategoryValue === clickedCategory.name) {
      return this.setState(this.resetCategorySelection);
    }

    const filteredItems = this.getFilteredItemsForCategory(
      allItems,
      clickedCategory,
    );

    this.setState({
      selectedCategory: clickedCategory.name,
      items: filteredItems,
    });
  };

  render() {
    const {
      categories,
      onSelectItem,
      showSearch,
      showCategories,
      mode,
    } = this.props;
    const { selectedCategory, items } = this.state;
    return (
      <StatelessElementBrowser
        items={items}
        categories={categories}
        onSearch={this.handleSearch}
        onSelectCategory={this.handleCategorySelection}
        onSelectItem={onSelectItem}
        onEnterKeyPress={onSelectItem}
        selectedCategory={selectedCategory}
        showSearch={showSearch}
        showCategories={showCategories}
        mode={mode}
      />
    );
  }
}
