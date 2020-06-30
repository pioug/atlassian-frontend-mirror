const getWidth = jest.fn();

jest.mock('../hooks/useContainerWidth', () => () => ({
  containerWidth: getWidth(),
  ContainerWidthMonitor: jest.fn(),
}));

import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import CategoryItems from '../components/CategoryItems';
import { Modes } from '../types';

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
};

const shallowRenderWithCustomWidth = (width: number): ShallowWrapper => {
  getWidth.mockReturnValueOnce(width);
  // 3 dives to skip analytics, context provider, and to get ThemeProvider
  const wrapper = shallow(<CategoryItems {...props} />);
  return wrapper
    .dive()
    .dive()
    .dive();
};

const getThemeProviderWidth = (width: number) => {
  const res: any = shallowRenderWithCustomWidth(width);
  return res.find('ThemeProvider').prop('theme')['@atlaskit-shared-theme/item']
    .width.default;
};

describe('CategoryItems', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<CategoryItems {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  describe('getItemWidthForContainer', () => {
    it('should get 50% width for an item if the container width is >= 400px', () => {
      expect(getThemeProviderWidth(500)).toStrictEqual('50%');
    });
    it('should get 33% width for an item if the container width is >= 600px and < 1024px', () => {
      expect(getThemeProviderWidth(601)).toStrictEqual('33%');
    });
    it('should get 25% width for an item if the container width is >= 1024px', () => {
      expect(getThemeProviderWidth(1025)).toStrictEqual('25%');
    });
  });
  it('should render CategoryItem component', () => {
    const wrapper = shallow(<CategoryItems {...props} />);
    const itemWrapper = wrapper
      .dive()
      .dive()
      .dive()
      .find('CategoryItem')
      .first();
    expect(itemWrapper).toMatchSnapshot();
  });
});
