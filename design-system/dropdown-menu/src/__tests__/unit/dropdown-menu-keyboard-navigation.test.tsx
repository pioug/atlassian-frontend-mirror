import React from 'react';

import {
  act,
  createEvent,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from '@testing-library/react';

import Example, {
  testId,
} from '../../../examples/98-testing-ddm-keyboard-navigation';

const triggerTestId = `${testId}--trigger`;
const dropdownMenuTestId = `${testId}--content`;

async function openDropdownMenu({ getByTestId, getAllByRole }: RenderResult) {
  const trigger = getByTestId(triggerTestId);
  trigger.focus();

  await act(async () => {
    fireEvent.click(trigger);
    await waitFor(() => getByTestId(dropdownMenuTestId));
  });

  const menuItems = getAllByRole('menuitem');
  return menuItems;
}

describe('Dropdown menu keyboard navigation', () => {
  it('should cancel the event when pressing UP on the first item', async () => {
    const renderResult = render(<Example />);
    const menuItems = await openDropdownMenu(renderResult);
    const firstMenuItem = menuItems[0];

    // Ensure the first item has focus
    firstMenuItem.focus();

    // Press up arrow
    const keydownEvent = createEvent.keyDown(firstMenuItem, { key: 'ArrowUp' });
    dispatchEvent(keydownEvent);

    // The event should have been cancelled to prevent scrolling
    expect(keydownEvent.defaultPrevented).toBe(true);
  });

  it('should cancel the event when pressing DOWN on the last item', async () => {
    const renderResult = render(<Example />);
    const menuItems = await openDropdownMenu(renderResult);
    const lastMenuItem = menuItems[menuItems.length - 1];

    // Ensure the last item has focus
    lastMenuItem.focus();

    // Press down arrow
    const keydownEvent = createEvent.keyDown(lastMenuItem, {
      key: 'ArrowDown',
    });
    dispatchEvent(keydownEvent);

    // The event should have been cancelled to prevent scrolling
    expect(keydownEvent.defaultPrevented).toBe(true);
  });
});
