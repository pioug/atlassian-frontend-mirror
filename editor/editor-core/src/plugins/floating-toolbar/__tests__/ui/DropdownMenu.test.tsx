import React from 'react';
import { waitFor, within } from '@testing-library/dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';
import DropdownMenu from '../../ui/DropdownMenu';
import type { DropdownOptionT } from '@atlaskit/editor-common/types';

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
    renderWithIntl(
      <DropdownMenu
        hide={jest.fn()}
        dispatchCommand={jest.fn()}
        items={items}
      />,
    );

    const buttonItems = screen.queryAllByRole('button');
    expect(buttonItems.length).toBe(2);

    const toolTips = screen.queryAllByRole('presentation');
    expect(toolTips.length).toBe(1);

    const toolTipButtons = within(toolTips[0]).queryAllByRole('button');
    expect(toolTipButtons.length).toBe(1);

    expect(toolTipButtons[0].textContent).toBe('item with tooltip');
  });

  it('should display the tooltip when mouse over', async () => {
    const dispatchCommand = (command: Function) => {
      return command();
    };
    const items: Array<DropdownOptionT<Function>> = [
      {
        onClick: jest.fn(),
        title: 'item with tooltip',
        tooltip: 'tooltip text',
      },
    ];

    renderWithIntl(
      <DropdownMenu
        hide={jest.fn().mockReturnValue(false)}
        dispatchCommand={dispatchCommand}
        items={items}
      />,
    );
    await flushPromises();
    expect(screen.queryByText('tooltip text')).not.toBeInTheDocument();

    const button = screen.getByText('item with tooltip');
    await userEvent.hover(button);
    await waitFor(async () => {
      expect(screen.queryByText('tooltip text')).toBeInTheDocument();
    });
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

    renderWithIntl(
      <DropdownMenu
        hide={jest.fn().mockReturnValue(false)}
        dispatchCommand={dispatchCommand}
        items={items}
      />,
    );
    await flushPromises();

    const menuItem = screen.getByTestId(menuItemTestId);

    await userEvent.hover(menuItem);
    expect(mockMouseEnter).toHaveBeenCalledTimes(1);
    expect(mockMouseOver).toHaveBeenCalledTimes(1);

    await userEvent.unhover(menuItem);
    expect(mockMouseLeave).toHaveBeenCalledTimes(1);
  });
});
