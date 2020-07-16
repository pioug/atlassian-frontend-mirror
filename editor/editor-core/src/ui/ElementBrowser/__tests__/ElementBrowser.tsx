import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { getConfluenceMacrosExtensionProvider } from '../../../../example-helpers/confluence-macros';
import { extensionProviderToQuickInsertProvider } from '../../../utils/extensions';
import EditorActions from '../../../actions';
import ElementBrowser from '../ElementBrowser';

const quickInsertProvider = extensionProviderToQuickInsertProvider(
  getConfluenceMacrosExtensionProvider({} as EditorActions),
  {} as EditorActions,
);
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
  onEnterKeyPress: jest.fn,
  showSearch: true,
  showCategories: true,
  mode: 'full',
  quickInsertProvider,
};

let wrapper: ShallowWrapper<any, any, ElementBrowser>;
let instance: ElementBrowser;

beforeEach(() => {
  wrapper = shallow(
    <ElementBrowser
      categories={testData.categories}
      quickInsertProvider={quickInsertProvider}
      showSearch={true}
      showCategories={false}
      search={jest.fn()}
      mode="inline"
      defaultCategory="all"
      onSelectItem={jest.fn()}
    />,
  );
  instance = wrapper.instance();
});

describe('ElementBrowser', () => {
  describe('onMount', () => {
    it('fetches quick insert items', () => {
      jest.spyOn(instance, 'fetchItems');
      instance.componentDidMount();
      expect(instance.fetchItems).toHaveBeenCalledTimes(1);
    });
  });
  describe('handleSearch', () => {
    it('Calls back the search handler with searchTerm, initialItems, and selectedCategory', () => {
      jest.spyOn(instance, 'handleSearch');
      instance.handleSearch('test');
      expect(instance.props.search).toHaveBeenCalledWith(
        'test',
        instance.state.allItems,
        instance.state.selectedCategory,
      );
    });
    it('Updates own state items with filtered results from searchTerm', () => {
      instance.handleSearch('test');
      const res = instance.props.search(
        'test',
        instance.state.allItems,
        instance.state.selectedCategory,
      );
      expect(instance.state.items).toStrictEqual(res);
    });
  });
  describe('onSelectCategory', () => {
    describe('getFilteredItemsForCategory', () => {
      const items = [
        {
          name: 'item-1',
          title: 'Item 1',
          action: jest.fn(),
          category: 'category-2',
        },
        {
          name: 'item-2',
          title: 'Item 2',
          action: jest.fn(),
          category: 'category-3',
        },
        {
          name: 'item-3',
          title: 'Item 3',
          action: jest.fn(),
          category: 'category-3',
        },
        {
          name: 'item-4',
          title: 'Item 4',
          action: jest.fn(),
          category: 'category-3',
        },
      ];
      it("Get's all items if selected category is all", () => {
        const res = instance.getFilteredItemsForCategory(items, {
          name: 'all',
          title: 'All',
        });
        expect(res).toEqual(items);
      });
      it("Get's items for a selected category", () => {
        const res = instance.getFilteredItemsForCategory(items, {
          name: 'category-2',
          title: 'Category 2',
        });
        /**
         * JSON.stringify is a Workaround
         * for the below error based on https://github.com/facebook/jest/issues/8475
         * Expected: [{...}]
         * Received: serializes to the same string
         */
        expect(JSON.stringify(res)).toEqual(
          JSON.stringify([
            {
              name: 'item-1',
              title: 'Item 1',
              action: jest.fn(),
              category: 'category-2',
            },
          ]),
        );
      });
    });
  });
  describe('resetCategorySelection', () => {
    it('resets the category selection if clicked on a same category twice ', () => {
      jest.spyOn(instance, 'handleCategorySelection');
      instance.setState({
        selectedCategory: 'category-1',
      });
      instance.handleCategorySelection({
        title: 'Category 1',
        name: 'category-1',
      });
      expect(instance.state.selectedCategory).toStrictEqual(
        instance.props.defaultCategory,
      );
    });
  });
});
