import React, { PureComponent } from 'react';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import StatelessElementBrowser from './components/StatelessElementBrowser';
import { Category, Modes } from './types';
import { EmptyStateHandler } from '../../types/empty-state-handler';

export interface Props {
  categories?: Category[];
  mode: keyof typeof Modes;
  getItems: (query?: string, category?: string) => QuickInsertItem[];
  onSelectItem?: (item: QuickInsertItem) => void;
  onInsertItem: (item: QuickInsertItem) => void;
  showSearch: boolean;
  showCategories: boolean;
  defaultCategory?: string;
  emptyStateHandler?: EmptyStateHandler;
}

export interface State {
  items: QuickInsertItem[];
  categories: Category[];
  selectedCategory?: string;
  searchTerm?: string;
}

export default class ElementBrowser extends PureComponent<Props, State> {
  static defaultProps = {
    defaultCategory: 'all',
    onInsertItem: () => {},
  };

  state: State = {
    categories: [],
    items: [],
    searchTerm: '',
    selectedCategory: this.props.defaultCategory,
  };

  componentDidMount() {
    const items = this.fetchItems();
    this.setState({
      items,
      categories: this.getCategories(items),
    });
  }

  getCategories = (items: QuickInsertItem[] = this.fetchItems()) =>
    // NOTE: we fetch all items to determine available categories.
    this.filterCategories(items, this.props.categories);

  filterCategories = (
    items: QuickInsertItem[],
    categories: Category[] = [],
  ): Category[] => {
    const { showCategories } = this.props;
    if (!showCategories) {
      return [];
    }
    return categories.filter(
      (category) =>
        category.name === 'all' ||
        items.some((item) => (item.categories || []).includes(category.name)),
    );
  };

  fetchItems = (query?: string, category?: string) => {
    return this.props.getItems(query, category);
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { searchTerm, selectedCategory } = this.state;

    // Update both items and categories when there's a new getItems
    if (this.props.getItems !== prevProps.getItems) {
      this.setState({
        categories: this.getCategories(),
        items: this.fetchItems(searchTerm, selectedCategory),
      });
    } else if (
      searchTerm !== prevState.searchTerm ||
      selectedCategory !== prevState.selectedCategory
    ) {
      this.setState({
        items: this.fetchItems(searchTerm, selectedCategory),
      });
    }
  }

  handleSearch = (searchTerm: string) => {
    const { defaultCategory } = this.props;
    this.setState({ searchTerm, selectedCategory: defaultCategory });
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
      searchTerm: '',
    });
  };

  render() {
    const {
      onInsertItem,
      onSelectItem,
      showSearch,
      showCategories,
      mode,
      emptyStateHandler,
    } = this.props;
    const { categories, searchTerm, selectedCategory, items } = this.state;
    return (
      <StatelessElementBrowser
        items={items}
        categories={categories}
        onSearch={this.handleSearch}
        onSelectCategory={this.handleCategorySelection}
        onSelectItem={onSelectItem}
        onInsertItem={onInsertItem}
        selectedCategory={selectedCategory}
        showSearch={showSearch}
        showCategories={showCategories}
        mode={mode}
        searchTerm={searchTerm}
        emptyStateHandler={emptyStateHandler}
      />
    );
  }
}
