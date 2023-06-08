import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { mountWithIntl } from '../../../../__tests__/__helpers/enzyme';
import { ButtonItem } from '@atlaskit/menu';
import DropdownMenu from '../../ui/DropdownMenu';
import { DropdownOptionT } from '../../ui/types';
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';

describe('<DropdownMenu />', () => {
  it('should wrap item inside a <Tooltip /> when tooltip option is present', () => {
    const items: Array<DropdownOptionT<Function>> = [
      {
        onClick: jest.fn(),
        title: 'item with tooltip',
        tooltip: 'tooltip text',
      },
      {
        onClick: jest.fn(),
        title: 'title without tooltip',
      },
    ];

    const dropdownMenu = mountWithIntl(
      <DropdownMenu
        hide={jest.fn()}
        dispatchCommand={jest.fn()}
        items={items}
      />,
    );

    expect(dropdownMenu.find(ButtonItem)).toHaveLength(2);
    expect(dropdownMenu.find(Tooltip)).toHaveLength(1);
    expect(dropdownMenu.find(Tooltip).prop('content')).toEqual('tooltip text');
    expect(dropdownMenu.find(Tooltip).find(ButtonItem)).toHaveLength(1);
    expect(dropdownMenu.find(Tooltip).find(ButtonItem).text()).toEqual(
      'item with tooltip',
    );
  });

  it('should trigger mouse events when mouse interact with the menu item', async () => {
    const dispatchCommand = (command: Function) => {
      return command();
    };
    const mockMouseEnter = jest.fn();
    const mockMouseOver = jest.fn();
    const mockMouseLeave = jest.fn();

    const menuItemTestId = 'test-menu-item';
    const items: Array<DropdownOptionT<Function>> = [
      {
        testId: menuItemTestId,
        onClick: jest.fn(),
        onMouseEnter: mockMouseEnter,
        onMouseOver: mockMouseOver,
        onMouseLeave: mockMouseLeave,
        title: 'Test Menu Item',
      },
    ];

    const dropdownMenu = mountWithIntl(
      <DropdownMenu
        hide={jest.fn().mockReturnValue(false)}
        dispatchCommand={dispatchCommand}
        items={items}
      />,
    );
    await flushPromises();

    const menuItem = dropdownMenu.find(
      `button[data-testid="${menuItemTestId}"]`,
    );
    expect(menuItem).toHaveLength(1);

    menuItem.simulate('mouseenter');
    expect(mockMouseEnter).toHaveBeenCalledTimes(1);

    menuItem.simulate('mouseover');
    expect(mockMouseOver).toHaveBeenCalledTimes(1);

    menuItem.simulate('mouseleave');
    expect(mockMouseLeave).toHaveBeenCalledTimes(1);
  });
});
