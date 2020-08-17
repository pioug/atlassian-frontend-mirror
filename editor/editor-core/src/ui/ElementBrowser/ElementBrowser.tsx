import React, { Component } from 'react';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import StatelessElementBrowser from './StatelessElementBrowser';
import { Category, Modes } from './types';

export interface Props {
  categories?: Category[];
  mode: keyof typeof Modes;
  getItems: (
    query?: string,
    category?: string,
  ) => QuickInsertItem[] | Promise<QuickInsertItem[]>;
  onSelectItem: (item: QuickInsertItem) => void;
  showSearch: boolean;
  showCategories: boolean;
  defaultCategory?: string;
}

export interface State {
  items: QuickInsertItem[];
  selectedCategory?: string;
  searchTerm?: string;
}

export default class ElementBrowser extends Component<Props, State> {
  state: State = {
    items: [],
    searchTerm: '',
    selectedCategory: this.props.defaultCategory,
  };

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = async (query?: string, category?: string) => {
    const items = await this.props.getItems(query, category);
    this.setState({ items });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { searchTerm, selectedCategory } = this.state;
    if (
      searchTerm !== prevState.searchTerm ||
      selectedCategory !== prevState.selectedCategory
    ) {
      this.fetchItems(searchTerm, selectedCategory);
    }
  }

  handleSearch = (searchTerm: string) => {
    this.setState({ searchTerm });
  };

  handleCategorySelection = (clickedCategory: Category) => {
    const { selectedCategory: stateCategoryValue } = this.state;

    /**
     * Reset selection if clicked on the same category twice.
     */
    if (stateCategoryValue === clickedCategory.name) {
      return this.setState({ selectedCategory: this.props.defaultCategory });
    }

    this.setState({
      selectedCategory: clickedCategory.name,
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
