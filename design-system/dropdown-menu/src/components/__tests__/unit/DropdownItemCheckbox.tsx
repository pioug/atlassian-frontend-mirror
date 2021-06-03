/* eslint-disable no-unused-vars */
import React from 'react';

import { mount, ReactWrapper } from 'enzyme';
import PropTypes from 'prop-types';

import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import Item from '@atlaskit/item';
import { B400, N40 } from '@atlaskit/theme/colors';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemGroupCheckbox,
  DropdownMenuStateless,
} from '../../../index';
import { KEY_ENTER, KEY_SPACE } from '../../../util/keys';

/**
 * TODO: replace these tests - AK-5183
 */

describe.skip('dropdown menu - DropdownItemCheckbox', () => {
  const isIconSelected = <Props extends {} = {}>(icon: ReactWrapper<Props>) =>
    icon.prop('primaryColor') === B400 && icon.prop('secondaryColor') === N40;

  describe('common use cases', () => {
    let wrapper: ReactWrapper;

    const clickItem = () => {
      wrapper.find(Item).first().simulate('click');
    };

    beforeEach(() => {
      wrapper = mount(
        <DropdownMenuStateless isOpen={true}>
          <DropdownItemGroupCheckbox id="check-items">
            <DropdownItemCheckbox id="zero">Item zero</DropdownItemCheckbox>
          </DropdownItemGroupCheckbox>
        </DropdownMenuStateless>,
      );
    });

    test('should render a checkbox icon', () => {
      expect(wrapper.find(CheckboxIcon).length).toBe(1);
    });

    test('should default the checkbox icon to unchecked', () => {
      expect(isIconSelected(wrapper.find(CheckboxIcon))).toBe(false);
    });

    test('should appear as checked when clicked, and unchecked when clicked again', () => {
      clickItem();
      expect(isIconSelected(wrapper.find(CheckboxIcon))).toBe(true);

      clickItem();
      expect(isIconSelected(wrapper.find(CheckboxIcon))).toBe(false);
    });

    // Cannot seem to mock window.navigator.userAgent in jest reliably. If/when possible, another
    // test for non-VoiceOver browsers would expect role="checkbox"
    test('should have role="menuitemcheckbox" on a browser that does not support VoiceOver', () => {
      expect(wrapper.find(Item).prop('role')).toBe('menuitemcheckbox');
    });
  });

  test('custom checkbox item onClick should be called when item clicked', () => {
    const clickSpy = jest.fn();
    const wrapper = mount(
      <DropdownMenuStateless isOpen>
        <DropdownItemGroupCheckbox id="check-items">
          <DropdownItemCheckbox id="zero" onClick={clickSpy}>
            Item zero
          </DropdownItemCheckbox>
        </DropdownItemGroupCheckbox>
      </DropdownMenuStateless>,
    );
    wrapper.find(Item).first().simulate('click');
    expect(clickSpy).toHaveBeenCalled();
  });

  [KEY_SPACE, KEY_ENTER].forEach((triggerKey) => {
    test(`custom checkbox item onClick should be called when "${triggerKey}" key pressed`, () => {
      const clickSpy = jest.fn();
      const wrapper = mount(
        <DropdownMenuStateless isOpen>
          <DropdownItemGroupCheckbox id="check-items">
            <DropdownItemCheckbox id="zero" onClick={clickSpy}>
              Item zero
            </DropdownItemCheckbox>
          </DropdownItemGroupCheckbox>
        </DropdownMenuStateless>,
      );
      wrapper.find(Item).first().simulate('keydown', { key: triggerKey });
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('defaultSelected prop', () => {
    test('causes item to be selected by default, but not if unselected and menu re-opened', () => {
      const wrapper = mount(
        <DropdownMenuStateless isOpen>
          <DropdownItemGroupCheckbox id="check-items">
            <DropdownItemCheckbox id="zero" defaultSelected>
              Item zero
            </DropdownItemCheckbox>
          </DropdownItemGroupCheckbox>
        </DropdownMenuStateless>,
      );
      expect(isIconSelected(wrapper.find(CheckboxIcon))).toBe(true);

      // Clicks the DropdownItemCheckbox to unselect it
      wrapper.find(Item).first().simulate('click');
      expect(isIconSelected(wrapper.find(CheckboxIcon))).toBe(false);

      // Causes the DropdownItemCheckbox to be unmounted and remounted
      wrapper.setProps({ isOpen: false });
      wrapper.setProps({ isOpen: true });

      expect(isIconSelected(wrapper.find(CheckboxIcon))).toBe(false);
    });
  });

  describe('isSelected prop', () => {
    interface Props {
      itemZeroProps?: {};
      itemOneProps?: {};
    }
    class IsSelectedController extends React.Component<Props> {
      static propTypes = {
        itemZeroProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        itemOneProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
      };

      render() {
        return (
          <DropdownMenu defaultOpen trigger={<span className="test-trigger" />}>
            <DropdownItemGroupCheckbox id="check-items">
              <DropdownItemCheckbox id="zero" {...this.props.itemZeroProps} />
              <DropdownItemCheckbox id="one" {...this.props.itemOneProps} />
            </DropdownItemGroupCheckbox>
          </DropdownMenu>
        );
      }
    }

    test('setting at mount should cause item to appear selected', () => {
      const wrapper = mount(
        <DropdownMenuStateless isOpen>
          <DropdownItemGroupCheckbox id="check-items">
            <DropdownItemCheckbox id="zero" isSelected>
              Item zero
            </DropdownItemCheckbox>
          </DropdownItemGroupCheckbox>
        </DropdownMenuStateless>,
      );
      expect(isIconSelected(wrapper.find(CheckboxIcon))).toBe(true);
    });

    test('setting at mount on multiple items should cause them to appear selected', () => {
      const wrapper = mount(
        <DropdownMenuStateless isOpen>
          <DropdownItemGroupCheckbox id="check-items">
            <DropdownItemCheckbox id="zero" isSelected>
              Item zero
            </DropdownItemCheckbox>
            <DropdownItemCheckbox id="one">Item one</DropdownItemCheckbox>
            <DropdownItemCheckbox id="two" isSelected>
              Item two
            </DropdownItemCheckbox>
          </DropdownItemGroupCheckbox>
        </DropdownMenuStateless>,
      );
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(0))).toBe(true);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(1))).toBe(false);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(2))).toBe(true);
    });

    test('setting after mount should cause item to appear selected', () => {
      const wrapper = mount(<IsSelectedController />);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(0))).toBe(false);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(1))).toBe(false);
      wrapper.setProps({ itemZeroProps: { isSelected: true } });
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(0))).toBe(true);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(1))).toBe(false);
    });

    test('setting to false after mount should cause item to appear unselected', () => {
      const wrapper = mount(
        <IsSelectedController itemZeroProps={{ isSelected: true }} />,
      );
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(0))).toBe(true);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(1))).toBe(false);
      wrapper.setProps({ itemZeroProps: { isSelected: false } });
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(0))).toBe(false);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(1))).toBe(false);
    });

    test('setting after mount should not fire onClick', () => {
      const clickSpy = jest.fn();
      const wrapper = mount(
        <IsSelectedController itemZeroProps={{ onClick: clickSpy }} />,
      );
      wrapper.setProps({ isSelected: true });
      expect(clickSpy).not.toHaveBeenCalled();
    });

    test('should still be applied when other items are clicked and the menu is reopened', () => {
      const clickSpyZero = jest.fn();
      const clickSpyOne = jest.fn();
      const wrapper = mount(
        <IsSelectedController
          itemZeroProps={{ isSelected: true, onClick: clickSpyZero }}
          itemOneProps={{ isSelected: false, onClick: clickSpyOne }}
        />,
      );
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(0))).toBe(true);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(1))).toBe(false);

      // Item is now not selected, and onClick has been called so app can update it's state
      wrapper.find(Item).at(0).simulate('click');
      wrapper.find(Item).at(1).simulate('click');
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(0))).toBe(false);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(1))).toBe(true);
      expect(clickSpyZero).toHaveBeenCalled();
      expect(clickSpyOne).toHaveBeenCalled();

      // Toggles the menu closed then open again
      wrapper.find('.test-trigger').simulate('click');
      wrapper.find('.test-trigger').simulate('click');

      // Item should still be selected, because it still has isSelected applied.
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(0))).toBe(true);
      expect(isIconSelected(wrapper.find(CheckboxIcon).at(1))).toBe(false);
    });
  });
});
