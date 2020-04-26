import React from 'react';

import { mount } from 'enzyme';

import Item from '@atlaskit/item';

import { DropdownItem } from '../../../index';

describe('dropdown menu - DropdownItem', () => {
  test('should render the children', () => {
    const wrapper = mount(
      <DropdownItem>
        <span className="my-text">Item zero</span>
      </DropdownItem>,
    );
    expect(wrapper.find('.my-text').exists()).toBe(true);
  });

  test('should have role="menuitem"', () => {
    const wrapper = mount(<DropdownItem />);
    expect(wrapper.find(Item).prop('role')).toBe('menuitem');
  });
});
