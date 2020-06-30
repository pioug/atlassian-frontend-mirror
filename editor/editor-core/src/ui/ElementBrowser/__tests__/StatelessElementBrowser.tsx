const getWidth = jest.fn();

jest.mock('../hooks/useContainerWidth', () => () => ({
  containerWidth: getWidth(),
  ContainerWidthMonitor: jest.fn(),
}));
import React from 'react';
import { shallow } from 'enzyme';
import { DEVICE_BREAKPOINT_NUMBERS } from '../constants';
import StatelessElementBrowser from '../StatelessElementBrowser';

export const testProps = {
  items: [{ name: 'item-1', title: 'Item 1', action: jest.fn() }],
  categories: [{ name: 'category-1', title: 'Category 1' }],
  selectedCategory: 'all',
  onSearch: jest.fn,
  onSelectCategory: jest.fn,
  onSelectItem: jest.fn,
  onEnterKeyPress: jest.fn,
  showSearch: true,
  showCategories: true,
};

describe('StatelessElementBrowser', () => {
  it('should render mobile components for width < 600', () => {
    getWidth.mockReturnValueOnce(DEVICE_BREAKPOINT_NUMBERS.small);
    const wrapper = shallow(
      <StatelessElementBrowser {...testProps} mode="inline" />,
    );
    expect(wrapper.find('MobileBrowser').shallow()).toMatchSnapshot();
  });
  it('should should not render desktop components on mobile', () => {
    getWidth.mockReturnValueOnce(DEVICE_BREAKPOINT_NUMBERS.small);
    const wrapper = shallow(
      <StatelessElementBrowser {...testProps} mode="inline" />,
    );
    expect(wrapper.find('DesktopBrowser')).toHaveLength(0);
  });
  it('should render desktop components for width >= 600', () => {
    getWidth.mockReturnValueOnce(DEVICE_BREAKPOINT_NUMBERS.medium);
    const wrapper = shallow(
      <StatelessElementBrowser {...testProps} mode="full" />,
    );
    expect(wrapper.find('DesktopBrowser').shallow()).toMatchSnapshot();
  });
  it('should should not render mobile components on desktop', () => {
    getWidth.mockReturnValueOnce(DEVICE_BREAKPOINT_NUMBERS.medium);
    const wrapper = shallow(
      <StatelessElementBrowser {...testProps} mode="full" />,
    );
    expect(wrapper.find('MobileBrowser')).toHaveLength(0);
  });
  it('should not render a sidebar heading on mobile', () => {
    getWidth.mockReturnValueOnce(DEVICE_BREAKPOINT_NUMBERS.small);
    const wrapper = shallow(
      <StatelessElementBrowser {...testProps} mode="inline" />,
    );
    expect(
      wrapper
        .find('MobileBrowser')
        .shallow()
        .find('SideBarHeading'),
    ).toHaveLength(0);
  });
  it('should render a sidebar heading on desktop', () => {
    getWidth.mockReturnValueOnce(DEVICE_BREAKPOINT_NUMBERS.medium);
    const wrapper = shallow(
      <StatelessElementBrowser {...testProps} mode="full" />,
    );
    expect(
      wrapper
        .find('DesktopBrowser')
        .shallow()
        .find('SideBarHeading'),
    ).toHaveLength(1);
  });
});
