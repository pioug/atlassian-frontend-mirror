const mockGetWidth = jest.fn();

jest.mock('../../../../hooks/use-container-width', () => {
  const originalHook = jest.requireActual(
    '../../../../hooks/use-container-width',
  ).default;
  return (...args: any) => ({
    ...originalHook(...args),
    containerWidth: mockGetWidth(),
  });
});

import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { ELEMENT_LIST_PADDING } from '../../../../constants';
import ElementList from '../../ElementList';
import EmptyState from '../../EmptyState';
import { Modes } from '../../../../types';
import { EmptyStateHandlerParams } from '../../../../../../types/empty-state-handler';

const props = {
  items: [
    {
      name: 'item-1',
      title: 'Item 1',
      action: jest.fn(),
      description: 'Item 1 description',
    },
    {
      name: 'item-2',
      title: 'Item 2',
      action: jest.fn(),
      description: 'Item 2 description',
    },
    {
      name: 'item-3',
      title: 'Item 3',
      action: jest.fn(),
      description: 'Item 3 description',
    },
    {
      name: 'item-4',
      title: 'Item 4',
      action: jest.fn(),
      description: 'Item 4 description',
    },
    {
      name: 'item-5',
      title: 'Item 5',
      action: jest.fn(),
      description: 'Item 5 description',
    },
  ],
  mode: Modes.full,
  onInsertItem: jest.fn(),
  onEnterKeyPress: jest.fn(),
  selectedItemIndex: 1,
  setSelectedItemIndex: jest.fn(),
  setFocusedItemIndex: jest.fn(),
  setColumnCount: jest.fn(),
};

let wrapper: ReactWrapper;

describe('ElementList', () => {
  it('should match snapshot', () => {
    const wrapper = mount(<ElementList {...props} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });

  describe('Collection', () => {
    it('renders a Virtualized Collection component with the right width', () => {
      mockGetWidth.mockReturnValueOnce(660);
      wrapper = mount(<ElementList {...props} />);
      const Collection = wrapper.find('Collection');
      expect(Collection).toHaveLength(1);
      expect(Collection.props().width).toStrictEqual(
        660 - ELEMENT_LIST_PADDING * 2,
      );
    });
    /**
     * Needs validation as there's a hack to remove tabIndex from react-virtualized/Collection.
     * If this className ever changes, the functionality may break.
     * ClassNames are specified here:
     * https://github.com/bvaughn/react-virtualized/blob/master/docs/Collection.md#class-names
     */
    it('has a className property with value ReactVirtualized__Collection', () => {
      expect(wrapper.find('.ReactVirtualized__Collection')).toHaveLength(1);
      wrapper.unmount();
    });
  });
  it('should select, focus, and scroll to given item index', () => {
    mockGetWidth.mockReturnValueOnce(660);
    const wrapper = mount(
      <ElementList {...props} selectedItemIndex={5} focusedItemIndex={5} />,
    );
    // @ts-ignore TS2339: scrollToCell prop exists on Collection component
    expect(wrapper.find('Collection').props().scrollToCell).toBe(5);
  });

  describe('ElementItem', () => {
    let offsetHeightSpy: jest.SpyInstance;

    beforeAll(() => {
      offsetHeightSpy = jest
        .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
        .mockReturnValue(500);
    });

    afterAll(() => {
      offsetHeightSpy.mockRestore();
    });

    it('should render each item inside the tooltip hitbox', () => {
      mockGetWidth.mockReturnValueOnce(660);

      wrapper = mount(
        <ElementList {...props} selectedItemIndex={5} focusedItemIndex={5} />,
      );
      const tooltipHitboxs = wrapper.find(
        '[data-testid^="element-item-tooltip"]',
      );
      expect(tooltipHitboxs.length).toBe(5);
      expect(
        tooltipHitboxs.first().find('span[data-testid="element-item-0"]')
          .length,
      ).toBe(1);
    });

    it('should pass the description to the tooltip component', () => {
      mockGetWidth.mockReturnValueOnce(660);
      const tooltipElements = wrapper.find('Tooltip');
      expect(tooltipElements.first().props().content).toBe(
        'Item 1 description',
      );
    });
  });

  describe('EmptyState Component', () => {
    let elementListProps: any;

    beforeEach(() => {
      elementListProps = { ...props };
    });

    it('should render generic EmptyState Component if emptyStateHandler props are not passed', () => {
      elementListProps.items = [];
      const wrapper = mount(<ElementList {...elementListProps} />);
      expect(wrapper.find(EmptyState)).toHaveLength(1);
    });

    it('should render product specific EmptyState component if search results are empty and emptyStateHandler prop is passed', () => {
      elementListProps.searchTerm = 'drawing'; //searchTerm
      elementListProps.items = [];
      elementListProps.emptyStateHandler = (
        params: EmptyStateHandlerParams,
      ) => <div id="app-container">App</div>; //Function that renders EmptyState component
      const wrapper = mount(<ElementList {...elementListProps} />);
      expect(wrapper.find('#app-container')).toHaveLength(1);
    });

    it('should pass correct params to emptyStateHandler', () => {
      elementListProps.items = [];
      elementListProps.searchTerm = 'drawing';
      elementListProps.selectedCategory = 'marketplace';
      elementListProps.emptyStateHandler = jest.fn();
      elementListProps.emptyStateHandler.mockReturnValue(
        <div id="app-container">App</div>,
      );

      mount(<ElementList {...elementListProps} />);

      expect(elementListProps.emptyStateHandler).toHaveBeenCalledWith({
        mode: elementListProps.mode,
        selectedCategory: elementListProps.selectedCategory,
        searchTerm: elementListProps.searchTerm,
      });
    });

    it('should not render product specific EmptyState component if search results list is not empty ', () => {
      elementListProps.searchTerm = 'drawing'; //searchTerm
      elementListProps.emptyStateHandler = (
        params: EmptyStateHandlerParams,
      ) => <div id="app-container">App</div>; //Function that renders EmptyState component
      const wrapper = mount(<ElementList {...elementListProps} />);
      expect(wrapper.find('#app-container')).toHaveLength(0);
    });
  });
});
