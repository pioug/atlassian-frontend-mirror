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
import { Modes } from '../../../../types';

const props = {
  items: [
    { name: 'item-1', title: 'Item 1', action: jest.fn() },
    { name: 'item-2', title: 'Item 2', action: jest.fn() },
    { name: 'item-3', title: 'Item 3', action: jest.fn() },
    { name: 'item-4', title: 'Item 4', action: jest.fn() },
    { name: 'item-5', title: 'Item 5', action: jest.fn() },
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
});
