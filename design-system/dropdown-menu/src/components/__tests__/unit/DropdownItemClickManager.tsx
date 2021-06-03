import React from 'react';

import { mount } from 'enzyme';

import { DropdownItem } from '../../../index';
import DropdownItemClickManager from '../../context/DropdownItemClickManager';

describe('dropdown menu - DropdownItemClickManager', () => {
  test('should fire onItemClicked when a DropdownItem is clicked', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <DropdownItemClickManager onItemClicked={spy}>
        <DropdownItem>Item</DropdownItem>
      </DropdownItemClickManager>,
    );
    wrapper.find(DropdownItem).simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  test('should call DropdownItem.onClick AND fire onItemClicked when a DropdownItem is clicked', () => {
    const spy = jest.fn();
    const spy2 = jest.fn();
    const wrapper = mount(
      <DropdownItemClickManager onItemClicked={spy}>
        <DropdownItem onClick={spy2}>Item</DropdownItem>
      </DropdownItemClickManager>,
    );
    wrapper.find(DropdownItem).simulate('click');
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  test('should not fire onItemClicked when a DropdownItem.isDisabled is clicked', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <DropdownItemClickManager onItemClicked={spy}>
        <DropdownItem isDisabled>Item</DropdownItem>
      </DropdownItemClickManager>,
    );
    wrapper.find(DropdownItem).simulate('click');
    expect(spy).not.toHaveBeenCalled();
  });

  test('should not fire onItemClicked when a DropdownItem link item (href) is clicked', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <DropdownItemClickManager onItemClicked={spy}>
        <DropdownItem href="//atlassian.com">Item</DropdownItem>
      </DropdownItemClickManager>,
    );
    wrapper.find(DropdownItem).simulate('click');
    expect(spy).not.toHaveBeenCalled();
  });

  ['Enter', 'Space'].forEach((triggerKey) => {
    test(`should fire onItemClicked when a DropdownItem is clicked via keyboard (with "${triggerKey}" key)`, () => {
      const spy = jest.fn();
      const wrapper = mount(
        <DropdownItemClickManager onItemClicked={spy}>
          <DropdownItem>Item</DropdownItem>
        </DropdownItemClickManager>,
      );
      wrapper.find(DropdownItem).simulate('keydown', { key: triggerKey });
      expect(spy).toHaveBeenCalled();
    });
  });

  test('should not fire onItemClicked when a DropdownItem is clicked via keyboard with ArrowDown key', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <DropdownItemClickManager onItemClicked={spy}>
        <DropdownItem>Item</DropdownItem>
      </DropdownItemClickManager>,
    );
    wrapper.find(DropdownItem).simulate('keydown', { key: 'ArrowDown' });
    expect(spy).not.toHaveBeenCalled();
  });
});
