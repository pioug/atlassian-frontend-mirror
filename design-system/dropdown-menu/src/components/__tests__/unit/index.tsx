/* eslint-disable no-unused-vars */
import React from 'react';

import { mount, ReactWrapper, shallow } from 'enzyme';

import {
  Appearance,
  CustomThemeButton as Button,
  CustomThemeButtonProps,
} from '@atlaskit/button';
import Droplist from '@atlaskit/droplist';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import MoreIcon from '@atlaskit/icon/glyph/more';

import Menu, {
  DropdownItem,
  DropdownItemGroup,
  DropdownMenuStatefulProps,
} from '../../../index';
import { KEY_DOWN, KEY_ENTER, KEY_ESC, KEY_SPACE } from '../../../util/keys';

const itemsList = (
  <DropdownItemGroup title="test1" elemAfter="AK-1234">
    <DropdownItem>Some text</DropdownItem>
  </DropdownItemGroup>
);

describe('dropdown menu', () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  test('should be possible to create a component', () => {
    expect(shallow(<Menu>test</Menu>)).not.toBe(undefined);
  });

  describe('render', () => {
    let wrapper: ReactWrapper<DropdownMenuStatefulProps>;

    beforeEach(() => {
      wrapper = mount(<Menu trigger="text">{itemsList}</Menu>);
    });

    test('should render Droplist component', () => {
      expect(wrapper.find(Droplist).length).toBe(1);
    });

    test('should pass required properties to Droplist', () => {
      const droplist = wrapper.find(Droplist);
      expect(droplist.prop('position')).toBe(wrapper.props().position);
      expect(droplist.prop('appearance')).toBe(wrapper.props().appearance);
      expect(droplist.prop('boundariesElement')).toBe(
        wrapper.props().boundariesElement,
      );
      expect(droplist.prop('shouldFlip')).toBe(wrapper.props().shouldFlip);
      expect(droplist.prop('isOpen')).toBe(false);
      // expect(droplist.prop('trigger')).toEqual(<div>text</div>);
      expect(droplist.prop('isLoading')).toBe(wrapper.props().isLoading);
    });

    test('should pass required properties to the button trigger', () => {
      [
        <Menu triggerType="button" trigger="text">
          {itemsList}
        </Menu>,
        <Menu triggerType="button" defaultOpen trigger="text">
          {itemsList}
        </Menu>,
      ].forEach((val) => {
        const menu = mount(val);
        const button = menu.find(Button);
        expect(button.prop('isSelected')).toBe(menu.props().defaultOpen);
        expect(button.prop('aria-haspopup')).toBe(true);
        expect(button.prop('aria-expanded')).toBe(menu.props().defaultOpen);
      });
    });

    /* TODO: create integration tests to replace these See https://ecosystem.atlassian.net/browse/AK-5183
    test('should pass elemAfter to Group', () => {
      const menu = mount(<Menu defaultOpen>{itemsList}</Menu>);
      const group = menu.find(DropdownItemGroup);
      menu.instance().dropdownListPositioned = true;
      menu.update();
      expect(group.prop('elemAfter')).toBe('AK-1234');
    });
    */

    test('should default to button with expand icon for triggerType=button with no overrides', () => {
      const text = 'text';
      const menu = mount(
        <Menu triggerType="button" trigger={text}>
          {itemsList}
        </Menu>,
      );
      const trigger = menu.find(Button);
      expect(trigger.prop('iconBefore')).toBe(undefined);
      expect(trigger.prop('iconAfter')).not.toBe(undefined);
      expect(trigger.prop('children')).toBe(text);
      expect(menu.find(ExpandIcon).length).toBe(1);
    });

    test('should pass through triggerButtonProps to the trigger for triggerType=button', () => {
      const triggerProps = {
        appearance: 'subtle' as Appearance,
        id: 'button-123',
        theme: (c, p) => c({ ...p, mode: 'dark' }),
      } as CustomThemeButtonProps;
      const menu = mount(
        <Menu triggerType="button" triggerButtonProps={triggerProps}>
          {itemsList}
        </Menu>,
      );
      const trigger = menu.find(Button);
      expect(trigger.prop('appearance')).toBe(triggerProps.appearance);
      expect(trigger.prop('id')).toBe(triggerProps.id);
      expect(trigger.prop('theme')).toBe(triggerProps.theme);
    });

    test('should render provided iconAfter in trigger instead of default expand icon if provided', () => {
      const triggerProps = {
        iconAfter: <MoreIcon label="more" />,
      };
      const menu = mount(
        <Menu triggerType="button" triggerButtonProps={triggerProps}>
          {itemsList}
        </Menu>,
      );
      const trigger = menu.find(Button);
      expect(trigger.prop('iconBefore')).toBe(undefined);
      expect(trigger.prop('iconAfter')).toBe(triggerProps.iconAfter);
      expect(menu.find(MoreIcon).length).toBe(1);
    });

    test('should render provided iconBefore in trigger instead of default expand icon if provided', () => {
      const triggerProps = {
        iconBefore: <MoreIcon label="more" />,
      };
      const menu = mount(
        <Menu triggerType="button" triggerButtonProps={triggerProps}>
          {itemsList}
        </Menu>,
      );
      const trigger = menu.find(Button);
      expect(trigger.prop('iconBefore')).toBe(triggerProps.iconBefore);
      expect(trigger.prop('iconAfter')).toBe(undefined);
      expect(menu.find(MoreIcon).length).toBe(1);
    });
  });

  describe('show/hide logic', () => {
    test('should be open when the defaultOpen property set to true', () => {
      expect(shallow<Menu>(<Menu defaultOpen>text</Menu>).state().isOpen).toBe(
        true,
      );
    });

    test('clicking with trigger should open the dropdown', () => {
      const wrapper = mount<Menu>(
        <Menu trigger={<div id="trigger">test</div>} />,
      );
      const trigger = wrapper.find('#trigger');
      expect(wrapper.state().isOpen).toBe(false);
      trigger.simulate('click');
      expect(wrapper.state().isOpen).toBe(true);
    });

    [KEY_SPACE, KEY_DOWN, KEY_ENTER].forEach((key) => {
      test(`pressing "${key}" key while trigger focused should open the dropdown`, () => {
        const wrapper = mount<Menu>(
          <Menu trigger={<div id="trigger">test</div>} />,
        );
        const trigger = wrapper.find('#trigger');
        const preventDefaultSpy = jest.fn();
        expect(wrapper.state().isOpen).toBe(false);
        trigger.simulate('keydown', { key, preventDefault: preventDefaultSpy });
        expect(wrapper.state().isOpen).toBe(true);
        expect(preventDefaultSpy).toHaveBeenCalled();
      });
    });

    test(`pressing ESC key should not call onOpenChange if menu is not opened`, () => {
      const spy = jest.fn();
      const wrapper = mount<Menu>(
        <Menu trigger={<div id="trigger">test</div>} onOpenChange={spy} />,
      );
      expect(wrapper.state().isOpen).toBe(false);
      const trigger = wrapper.find('#trigger');

      trigger.simulate('keydown', { key: KEY_ESC });
      expect(spy).not.toHaveBeenCalled();
      expect(wrapper.state().isOpen).toBe(false);
    });

    /* TODO: create integration tests to replace these See https://ecosystem.atlassian.net/browse/AK-5183
    test('interacting with checkbox item should not close the menu', () => {
      const wrapper = mount(
        <Menu defaultOpen>
          <DropdownItemGroupCheckbox id="check-items" title="Items">
            <DropdownItemCheckbox id="option-one">Option</DropdownItemCheckbox>
          </DropdownItemGroupCheckbox>
        </Menu>,
      );
      const item = wrapper.find(DropdownItemCheckbox);
      expect(wrapper.state().isOpen).toBe(true);
      item.simulate('click');
      expect(wrapper.state().isOpen).toBe(true);
    });
    */
  });
});
