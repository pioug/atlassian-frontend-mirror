import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { replaceRaf, Stub } from 'raf-stub';

import { KEY_DOWN, KEY_END, KEY_HOME, KEY_UP } from '@atlaskit/ds-lib/keycodes';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../index';

describe('dropdown menu keyboard navigation', () => {
  // requestAnimationFrame is replaced by raf-stub
  replaceRaf();
  const requestAnimationFrame = window.requestAnimationFrame as unknown as Stub;

  afterAll(() => {
    requestAnimationFrame.reset();
  });

  function openDropdownWithClick(element: HTMLElement) {
    // JSDOM sets clientX and clientY to 0,0
    // for all click events. This breaks the if condition
    // used inside dropdown menu to diffrenciate mouse clicks
    // from the "clicks" triggered by the keyboard
    // when Enter or Space is pressed.
    fireEvent.click(element, {
      clientX: 1,
      clientY: 1,
      detail: 1,
    });

    requestAnimationFrame.step();
  }

  function openDropdownWithKeydown(element: HTMLElement) {
    fireEvent.focus(element);
    requestAnimationFrame.step();

    fireEvent.keyDown(element, {
      key: KEY_DOWN,
      code: KEY_DOWN,
    });
    requestAnimationFrame.flush();
  }

  const items = ['Move', 'Clone', 'Delete'];
  const testId = 'testId';

  it('should NOT open the menu when DOWN arrow is pressed while the trigger is NOT focused', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          {items.map((text) => (
            <DropdownItem>{text}</DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>,
    );

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_DOWN,
      code: KEY_DOWN,
    });

    expect(screen.queryByTestId(`${testId}--content`)).not.toBeInTheDocument();
  });

  it('should open the menu when DOWN arrow is pressed while the trigger is focused', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          {items.map((text) => (
            <DropdownItem>{text}</DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));

    expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
  });

  describe('with open menu', () => {
    it('should focus the first element by default when accessed using a keyboard', () => {
      const triggerText = 'click me to open';

      render(
        <DropdownMenu trigger={triggerText} testId={testId}>
          <DropdownItemGroup>
            {items.map((text) => (
              <DropdownItem>{text}</DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
      expect(screen.getByText(items[0])).toBeInTheDocument();

      requestAnimationFrame.step();

      const firstMenuItem = screen.getAllByRole('menuitem')[0];
      expect(firstMenuItem).toHaveAccessibleName(items[0]);
      expect(firstMenuItem).toHaveFocus();
    });

    it('should focus the content wrapper when clicked with a mouse', () => {
      const triggerText = 'click me to open';

      render(
        <DropdownMenu trigger={triggerText} testId={testId}>
          <DropdownItemGroup>
            {items.map((text) => (
              <DropdownItem>{text}</DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

      expect(screen.getByText(items[0])).toBeInTheDocument();
      requestAnimationFrame.step();

      expect(screen.getByTestId(`${testId}--content`)).toHaveFocus();
    });

    it('should focus the next element on pressing the DOWN arrow', () => {
      const triggerText = 'click me to open';

      render(
        <DropdownMenu trigger={triggerText} testId={testId}>
          <DropdownItemGroup>
            {items.map((text) => (
              <DropdownItem>{text}</DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>,
      );
      openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

      fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });

      fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });

      requestAnimationFrame.step();

      const secondMenuItem = screen.getAllByRole('menuitem')[1];
      expect(secondMenuItem).toHaveAccessibleName(items[1]);
      expect(secondMenuItem).toHaveFocus();
    });
  });

  it('should focus the previous element on pressing the UP arrow', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          {items.map((text) => (
            <DropdownItem>{text}</DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_DOWN,
      code: KEY_DOWN,
    });

    const firstMenuItem = screen.getAllByRole('menuitem')[0];
    expect(firstMenuItem).toHaveAccessibleName(items[0]);
    expect(firstMenuItem).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_UP,
      code: KEY_UP,
    });
    requestAnimationFrame.step();

    expect(firstMenuItem).toHaveFocus();
  });

  it('should skip over disabled items while keyboard navigating', () => {
    const second = 'Second';
    const fourth = 'Fourth';
    const secondLast = 'Second Last';
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          <DropdownItem isDisabled>First</DropdownItem>
          <DropdownItem>{second}</DropdownItem>
          <DropdownItem isDisabled={true}>Third</DropdownItem>
          <DropdownItem>{fourth}</DropdownItem>
          <DropdownItem>{secondLast}</DropdownItem>
          <DropdownItem isDisabled>Last</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_DOWN,
      code: KEY_DOWN,
    });

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_DOWN,
      code: KEY_DOWN,
    });

    requestAnimationFrame.step();

    const allMenuItems = screen.getAllByRole('menuitem');
    const fourthMenuItem = allMenuItems[3];
    expect(fourthMenuItem).toHaveAccessibleName(fourth);
    expect(fourthMenuItem).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_UP,
      code: KEY_UP,
    });
    requestAnimationFrame.step();

    const secondMenuItem = allMenuItems[1];
    expect(secondMenuItem).toHaveAccessibleName(second);
    expect(secondMenuItem).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_END,
      code: KEY_END,
    });
    requestAnimationFrame.step();

    const secondLastMenuItem = allMenuItems.slice(-2)[0];
    expect(secondLastMenuItem).toHaveAccessibleName(secondLast);
    expect(secondLastMenuItem).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_HOME,
      code: KEY_HOME,
    });
    requestAnimationFrame.step();

    expect(secondMenuItem).toHaveFocus();
  });

  it('should skip disabled elements and focus on the first focusable element with autoFucus', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId} autoFocus>
        <DropdownItemGroup>
          <DropdownItem isDisabled>{items[0]}</DropdownItem>
          <DropdownItem>{items[1]}</DropdownItem>
          <DropdownItem>{items[2]}</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

    const secondMenuItem = screen.getAllByRole('menuitem')[1];
    expect(secondMenuItem).toHaveAccessibleName(items[1]);
    expect(secondMenuItem).toHaveFocus();
  });

  it('should skip disabled elements and focus on the first focusable element with keyboard navigation', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          <DropdownItem isDisabled>{items[0]}</DropdownItem>
          <DropdownItem>{items[1]}</DropdownItem>
          <DropdownItem>{items[2]}</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));

    const secondMenuItem = screen.getAllByRole('menuitem')[1];
    expect(secondMenuItem).toHaveAccessibleName(items[1]);
    expect(secondMenuItem).toHaveFocus();
  });

  it('should focus the first element on pressing the HOME arrow', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          {items.map((text) => (
            <DropdownItem>{text}</DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_DOWN,
      code: KEY_DOWN,
    });

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_HOME,
      code: KEY_HOME,
    });
    requestAnimationFrame.step();

    const firstMenuItem = screen.getAllByRole('menuitem')[0];
    expect(firstMenuItem).toHaveAccessibleName(items[0]);
    expect(firstMenuItem).toHaveFocus();
  });

  it('should focus the last element on pressing the END arrow', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          {items.map((text) => (
            <DropdownItem>{text}</DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(screen.getByTestId(`${testId}--trigger`));

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_DOWN,
      code: KEY_DOWN,
    });

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_END,
      code: KEY_END,
    });

    requestAnimationFrame.step();

    const lastMenuItem = screen.getAllByRole('menuitem').slice(-1)[0];
    expect(lastMenuItem).toHaveAccessibleName(items.slice(-1)[0]);
    expect(lastMenuItem).toHaveFocus();
  });

  it('should not let the focus loop to the last element', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          {items.map((text) => (
            <DropdownItem>{text}</DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>,
    );

    // Open the menu and bring focus to the first element be focused
    openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));

    const firstMenuItem = screen.getAllByRole('menuitem')[0];
    expect(firstMenuItem).toHaveAccessibleName(items[0]);
    expect(firstMenuItem).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_UP,
      code: KEY_UP,
    });
    requestAnimationFrame.step();

    // Assert that the focus hasn't looped over to the last element
    expect(firstMenuItem).toHaveFocus();
  });

  it('should not let the focus loop on the first element', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          {items.map((text) => (
            <DropdownItem>{text}</DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>,
    );

    // Open menu and assert first element is focused
    openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
    const firstMenuItem = screen.getAllByRole('menuitem')[0];
    expect(firstMenuItem).toHaveAccessibleName(items[0]);
    expect(firstMenuItem).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_UP,
      code: KEY_UP,
    });
    requestAnimationFrame.step();

    // Assert that the focus hasn't looped over to the last element
    expect(firstMenuItem).toHaveFocus();
  });

  it('should not let the focus loop to the first element', () => {
    const triggerText = 'click me to open';

    render(
      <DropdownMenu trigger={triggerText} testId={testId}>
        <DropdownItemGroup>
          {items.map((text) => (
            <DropdownItem>{text}</DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    // Open menu and assert first element is focused
    openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
    const firstMenuItem = screen.getAllByRole('menuitem')[0];
    expect(firstMenuItem).toHaveAccessibleName(items[0]);
    expect(firstMenuItem).toHaveFocus();

    // Bring the focus to the last element
    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_END,
      code: KEY_END,
    });
    requestAnimationFrame.step();

    fireEvent.keyDown(screen.getByTestId(`${testId}--trigger`), {
      key: KEY_DOWN,
      code: KEY_DOWN,
    });
    // Assert that the focus hasn't looped over to the first element
    const lastMenuItem = screen.getAllByRole('menuitem').slice(-1)[0];
    expect(lastMenuItem).toHaveAccessibleName(items.slice(-1)[0]);
    expect(lastMenuItem).toHaveFocus();
  });

  it('should not allow the dropdown to reopen if the trigger is activated again', () => {
    const onOpenChange = jest.fn();
    render(
      <DropdownMenu testId={testId} onOpenChange={onOpenChange}>
        <DropdownItemGroup>
          {items.map((text) => (
            <DropdownItem>{text}</DropdownItem>
          ))}
        </DropdownItemGroup>
      </DropdownMenu>,
    );

    openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
    expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith({
      isOpen: true,
      event: expect.any(KeyboardEvent),
    });
    expect(onOpenChange).toHaveBeenCalledTimes(1);

    onOpenChange.mockClear();

    // this should not be possible to do as focus should not be able
    // to go back to the trigger when the menu is open, but checking here to be safe
    openDropdownWithKeydown(screen.getByTestId(`${testId}--trigger`));
    expect(screen.getByTestId(`${testId}--content`)).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  describe('nested dropdown', () => {
    const NestedDropdown = ({ level = 0 }) => {
      return (
        <DropdownMenu
          placement="right-start"
          trigger="nested"
          testId={`nested-${level}`}
        >
          <DropdownItemGroup>
            <NestedDropdown level={level + 1} />
            <DropdownItem testId={`nested-item1-${level + 1}`}>
              One of many items
            </DropdownItem>
            <DropdownItem testId={`nested-item2-${level + 1}`}>
              One of many items
            </DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      );
    };
    // should have arrow navigation work
    ffTest(
      'platform.design-system-team.layering_popup_1cnzt',
      // Test when true
      () => {
        render(<NestedDropdown />);
        let level = 0;
        while (level < 3) {
          // test nested dropdown can be opened correctly
          const nestedTrigger = screen.getByTestId(`nested-${level}--trigger`);
          expect(nestedTrigger).toBeInTheDocument();
          openDropdownWithKeydown(nestedTrigger);
          level += 1;
        }
        const nestedTrigger = screen.getByTestId(`nested-${level}--trigger`);
        expect(nestedTrigger).toHaveFocus();
        // test on arrow navigation
        fireEvent.keyDown(window, {
          key: KEY_DOWN,
          code: KEY_DOWN,
        });
        const nestedItem1 = screen.getByTestId(`nested-item1-${level}`);
        expect(nestedItem1).toHaveFocus();

        fireEvent.keyDown(window, {
          key: KEY_DOWN,
          code: KEY_DOWN,
        });
        const nestedItem2 = screen.getByTestId(`nested-item2-${level}`);
        expect(nestedItem2).toHaveFocus();

        fireEvent.keyDown(window, {
          key: KEY_UP,
          code: KEY_UP,
        });
        expect(nestedItem1).toHaveFocus();
      },
      () => {
        render(<NestedDropdown />);
        // test nested dropdown can be opened correctly
        const nestedTrigger = screen.getByTestId('nested-0--trigger');
        expect(nestedTrigger).toBeInTheDocument();
        openDropdownWithKeydown(nestedTrigger);
        const nestedItem1 = screen.getByTestId('nested-1--trigger');
        expect(nestedItem1).toHaveFocus();
      },
    );
  });
});
