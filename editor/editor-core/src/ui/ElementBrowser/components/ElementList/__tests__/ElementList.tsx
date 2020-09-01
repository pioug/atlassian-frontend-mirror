const getWidth = jest.fn();

jest.mock('../../../hooks/use-container-width', () => {
  const originalHook = jest.requireActual('../../../hooks/use-container-width')
    .default;
  return (...args: any) => ({
    ...originalHook(...args),
    containerWidth: getWidth(),
  });
});

import React from 'react';
import { shallow, ReactWrapper, mount } from 'enzyme';
import ElementList from '../ElementList';
import { Modes } from '../../../types';

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
    const wrapper = shallow(<ElementList {...props} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });
  describe('Collection', () => {
    it('renders a Virtualized Collection component with the right width', () => {
      getWidth.mockReturnValueOnce(660);
      wrapper = mount(<ElementList {...props} />);
      const Collection = wrapper.find('Collection');
      expect(Collection).toHaveLength(1);
      expect(Collection.props().width).toStrictEqual(660);
      wrapper.unmount();
    });
  });
  it('should select, focus, and scroll to given item index', () => {
    getWidth.mockReturnValueOnce(660);
    const wrapper = mount(
      <ElementList {...props} selectedItemIndex={5} focusedItemIndex={5} />,
    );
    // @ts-ignore TS2339: scrollToCell prop exists on Collection component
    expect(wrapper.find('Collection').props().scrollToCell).toBe(5);
  });
});
