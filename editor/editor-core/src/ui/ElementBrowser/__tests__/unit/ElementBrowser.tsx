import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import ElementBrowser from '../../ElementBrowser';

const testData = {
  categories: [
    { name: 'all', title: 'all' },
    { name: 'category-1', title: 'Category 1' },
    { name: 'category-2', title: 'Category 2' },
    { name: 'category-3', title: 'Category 3' },
    { name: 'category-4', title: 'Category 4' },
    { name: 'category-5', title: 'Category 5' },
    { name: 'category-6', title: 'Category 6' },
    { name: 'category-7', title: 'Category 7' },
    { name: 'category-8', title: 'Category 8' },
    { name: 'category-9', title: 'Category 9' },
    { name: 'category-10', title: 'Category 10' },
  ],
  onSearch: jest.fn,
  onSelectCategory: jest.fn,
  onSelectItem: jest.fn,
  onInsertItem: jest.fn,
  onEnterKeyPress: jest.fn,
  showSearch: true,
  showCategories: true,
  mode: 'full',
};

let wrapper: ShallowWrapper<any, any, ElementBrowser>;
let instance: ElementBrowser;

let getItems: jest.Mock;

beforeEach(() => {
  getItems = jest.fn(() => [
    {
      name: 'item-1',
      title: 'Item 1',
      action: jest.fn(),
      categories: ['category-2'],
    },
    {
      name: 'item-2',
      title: 'Item 2',
      action: jest.fn(),
      categories: ['category-3'],
    },
    {
      name: 'item-3',
      title: 'Item 3',
      action: jest.fn(),
      categories: ['category-3'],
    },
    {
      name: 'item-4',
      title: 'Item 4',
      action: jest.fn(),
      categories: ['category-3'],
    },
  ]);

  wrapper = shallow(
    <ElementBrowser
      categories={testData.categories}
      getItems={getItems}
      showSearch={true}
      showCategories={true}
      mode="inline"
      defaultCategory="all"
      onSelectItem={jest.fn()}
      onInsertItem={jest.fn()}
    />,
  );
  instance = wrapper.instance();

  getItems.mockClear();
});

describe('ElementBrowser', () => {
  describe('onMount', () => {
    it('fetches quick insert items', () => {
      instance.componentDidMount();
      expect(getItems).toHaveBeenCalledTimes(1);
    });
    it('re-fetches quick insert items when getItems changes', () => {
      const getItems = jest.fn(() => []);
      wrapper.setProps({ getItems });
      // One call is to get all items to update categories
      // The other one is to find the filtered list items
      expect(getItems).toHaveBeenCalledTimes(2);
    });
    it('loads categories that have items', async () => {
      const res = instance.filterCategories(
        await getItems(),
        testData.categories,
      );
      const expectedRes = [
        { name: 'all', title: 'all' },
        { name: 'category-2', title: 'Category 2' },
        { name: 'category-3', title: 'Category 3' },
      ];
      expect(res).toStrictEqual(expectedRes);
      expect(instance.state.categories).toStrictEqual(expectedRes);
    });
    it('loads an empty array when showCategories is false', () => {
      wrapper = shallow(
        <ElementBrowser
          categories={testData.categories}
          getItems={getItems}
          showSearch
          showCategories={false}
          mode="inline"
          defaultCategory="all"
          onSelectItem={jest.fn()}
          onInsertItem={jest.fn()}
        />,
      );
      instance = wrapper.instance();
      const res = instance.filterCategories(getItems(), testData.categories);
      expect(res).toStrictEqual([]);
      expect(instance.state.categories).toStrictEqual([]);
    });
  });
  describe('handleSearch', () => {
    it('should call the getItems passing the search term and selected category', () => {
      instance.handleSearch('test');
      expect(getItems).toHaveBeenCalledWith('test', 'all');
      expect(getItems).toHaveBeenCalledTimes(1);
    });
    it('should reset the category selection back to default', () => {
      instance.handleSearch('Jira');
      expect(instance.state.searchTerm).toBe('Jira');
      expect(instance.state.selectedCategory).toBe(
        instance.props.defaultCategory,
      );
    });
    it('should clear the previous category selection and reset to default', () => {
      instance.handleCategorySelection({
        name: 'category-10',
        title: 'Category 10',
      });
      expect(instance.state.selectedCategory).toBe('category-10');
      instance.handleSearch('Confluence');
      expect(instance.state.searchTerm).toBe('Confluence');
      expect(instance.state.selectedCategory).toStrictEqual(
        instance.props.defaultCategory,
      );
    });
  });
  describe('onSelectCategory', () => {
    describe('handleCategorySelection', () => {
      it('should calls getItems with the new category', () => {
        instance.handleCategorySelection({
          name: 'category-1',
          title: 'Category 1',
        });

        expect(getItems).toHaveBeenCalledWith('', 'category-1');
        expect(getItems).toHaveBeenCalledTimes(1);
      });

      it('should clear the search term', () => {
        instance.handleCategorySelection({
          name: 'category-3',
          title: 'Category 3',
        });
        expect(instance.state.selectedCategory).toBe('category-3');
        expect(instance.state.searchTerm).toStrictEqual('');
      });

      it('should reset the category to default if selected twice', () => {
        wrapper.setState({ selectedCategory: 'category-1' });
        getItems.mockClear();
        instance.handleCategorySelection({
          name: 'category-1',
          title: 'Category 1',
        });

        expect(getItems).toHaveBeenCalledWith('', 'all');
        expect(getItems).toHaveBeenCalledTimes(1);
      });
    });
  });
});
