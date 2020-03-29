import React from 'react';
import { mount } from 'enzyme';
import { DropdownMenuStateless } from '@atlaskit/dropdown-menu';
import { GlobalItem } from '@atlaskit/navigation-next';

import ItemComponent from '../..';

describe('ItemComponent', () => {
  it('should render a GlobalItem by default', () => {
    const wrapper = mount(<ItemComponent icon={() => null} />);
    expect(wrapper.find(GlobalItem).exists()).toBe(true);
  });

  describe('when passsed dropdownItems', () => {
    it('should render a DropdownMenuStateless with a GlobalItem as the trigger', () => {
      const DropdownItems = () => null;
      const wrapper = mount(
        <ItemComponent dropdownItems={DropdownItems} icon={() => null} />,
      );
      expect(wrapper.find(DropdownMenuStateless).exists()).toBe(true);
      expect(wrapper.find(GlobalItem).exists()).toBe(true);
    });

    it('should render a DropdownMenuStateless with appearance "tall"', () => {
      const DropdownItems = () => [];
      const wrapper = mount(
        <ItemComponent dropdownItems={DropdownItems} icon={() => null} />,
      );
      expect(wrapper.find(DropdownMenuStateless).prop('appearance')).toBe(
        'tall',
      );
    });
  });

  it('should render a completely custom component if passed an itemComponent', () => {
    const CustomItem = () => null;
    const wrapper = mount(
      <ItemComponent itemComponent={CustomItem} icon={() => null} />,
    );
    expect(wrapper.find(CustomItem).exists()).toBe(true);
    expect(wrapper.find(GlobalItem).exists()).toBe(false);
  });

  it('should not include "NavigationAnalyticsContext" for any component other than notification', () => {
    const wrapper = mount(<ItemComponent icon={() => null} />);
    expect(wrapper.find('NavigationAnalyticsContext').exists()).toBeFalsy();
  });

  it('should include "NavigationAnalyticsContext" for notification', () => {
    const wrapper = mount(<ItemComponent badgeCount={10} icon={() => null} />);
    expect(wrapper.find('NavigationAnalyticsContext').exists()).toBeTruthy();
  });

  it('should include "NavigationAnalyticsContext" with the correct parameters for notification', () => {
    const wrapper = mount(<ItemComponent badgeCount={10} icon={() => null} />);
    expect(wrapper.find('NavigationAnalyticsContext').props().data).toEqual({
      attributes: {
        badgeCount: 10,
      },
    });

    wrapper.setProps({
      badgeCount: 0,
    });
    wrapper.update();
    expect(wrapper.find('NavigationAnalyticsContext').props().data).toEqual({
      attributes: {
        badgeCount: 0,
      },
    });
  });
});
