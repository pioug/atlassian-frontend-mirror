const getWidth = jest.fn();

jest.mock('../../hooks/useContainerWidth', () => {
  const originalHook = jest.requireActual('../../hooks/useContainerWidth')
    .default;
  return (...args: any) => ({
    ...originalHook(...args),
    containerWidth: getWidth(),
  });
});

import React from 'react';
import { shallow, ReactWrapper, mount } from 'enzyme';
import ElementList from '../ElementList';
import { Modes } from '../../types';

const props = {
  items: [
    { name: 'item-1', title: 'Item 1', action: jest.fn() },
    { name: 'item-2', title: 'Item 2', action: jest.fn() },
    { name: 'item-3', title: 'Item 3', action: jest.fn() },
    { name: 'item-4', title: 'Item 4', action: jest.fn() },
    { name: 'item-5', title: 'Item 5', action: jest.fn() },
  ],
  mode: Modes.full,
  onSelectItem: jest.fn(),
  onEnterKeyPress: jest.fn(),
  selectedItemIndex: 1,
  setSelectedItemIndex: jest.fn(),
  setFocusedItemIndex: jest.fn(),
  setItemsContainerWidth: jest.fn(),
};

const getThemeProviderWidth = (wrapper: any) => {
  return wrapper.find('ThemeProvider').prop('theme')[
    '@atlaskit-shared-theme/item'
  ].width.default;
};

let wrapper: ReactWrapper;

describe('ElementList', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<ElementList {...props} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });
  describe('getItemWidthForContainer', () => {
    it('should get 50% width for an item if the container width is >= 400px', () => {
      getWidth.mockReturnValueOnce(500);
      wrapper = mount(<ElementList {...props} />);
      expect(getThemeProviderWidth(wrapper)).toStrictEqual('50%');
      wrapper.unmount();
    });
    it('should get 33% width for an item if the container width is >= 600px and < 1024px', () => {
      getWidth.mockReturnValueOnce(601);
      wrapper = mount(<ElementList {...props} />);
      expect(getThemeProviderWidth(wrapper)).toStrictEqual('33%');
      wrapper.unmount();
    });
    it('should get 25% width for an item if the container width is >= 1024px', () => {
      getWidth.mockReturnValueOnce(1025);
      wrapper = mount(<ElementList {...props} />);
      expect(getThemeProviderWidth(wrapper)).toStrictEqual('25%');
      wrapper.unmount();
    });
  });
  it('should render ElementItem component', () => {
    const wrapper = mount(<ElementList {...props} />);
    expect(wrapper.find('MemoizedElementItem').first()).toHaveLength(1);
    wrapper.unmount();
  });
});
