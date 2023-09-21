import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
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
    act(() => {
      fireEvent.click(element, {
        clientX: 1,
        clientY: 1,
      });
    });

    requestAnimationFrame.step();
  }

  function openDropdownWithKeydown(element: HTMLElement) {
    act(() => {
      fireEvent.focus(element);
    });
    requestAnimationFrame.step();

    act(() => {
      fireEvent.keyDown(element, {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });
    });
    requestAnimationFrame.flush();
  }

  it('should NOT open the menu when DOWN arrow is pressed while the trigger is NOT focused', () => {
    const triggerText = 'click me to open';

    const { getByTestId, queryByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });
    });

    expect(queryByTestId('dropdown--content')).not.toBeInTheDocument();
  });

  it('should open the menu when DOWN arrow is pressed while the trigger is focused', () => {
    const triggerText = 'click me to open';

    const { queryByTestId, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithKeydown(getByTestId('dropdown--trigger'));

    expect(queryByTestId('dropdown--content')).toBeInTheDocument();
  });

  describe('with open menu', () => {
    it('should focus the first element by default when accessed using a keyboard', () => {
      const triggerText = 'click me to open';

      const { getByText, getByTestId } = render(
        <DropdownMenu trigger={triggerText} testId="dropdown">
          <DropdownItemGroup>
            <DropdownItem>Move</DropdownItem>
            <DropdownItem>Clone</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      openDropdownWithKeydown(getByTestId('dropdown--trigger'));
      expect(getByText('Move')).toBeInTheDocument();

      requestAnimationFrame.step();

      expect(getByText('Move').closest('button')).toHaveFocus();
    });

    it('should focus the content wrapper when clicked with a mouse', () => {
      const triggerText = 'click me to open';

      const { getByText, getByTestId } = render(
        <DropdownMenu trigger={triggerText} testId="dropdown">
          <DropdownItemGroup>
            <DropdownItem>Move</DropdownItem>
            <DropdownItem>Clone</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );

      openDropdownWithClick(getByTestId('dropdown--trigger'));

      expect(getByText('Move')).toBeInTheDocument();
      requestAnimationFrame.step();

      expect(getByTestId('dropdown--content')).toHaveFocus();
    });

    it('should focus the next element on pressing the DOWN arrow', () => {
      const triggerText = 'click me to open';

      const { getByText, getByTestId } = render(
        <DropdownMenu trigger={triggerText} testId="dropdown">
          <DropdownItemGroup>
            <DropdownItem>Move</DropdownItem>
            <DropdownItem>Clone</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>,
      );
      openDropdownWithClick(getByTestId('dropdown--trigger'));

      act(() => {
        fireEvent.keyDown(getByTestId('dropdown--trigger'), {
          key: KEY_DOWN,
          code: KEY_DOWN,
        });
      });

      act(() => {
        fireEvent.keyDown(getByTestId('dropdown--trigger'), {
          key: KEY_DOWN,
          code: KEY_DOWN,
        });
      });

      requestAnimationFrame.step();

      expect(getByText('Clone').closest('button')).toHaveFocus();
    });
  });

  it('should focus the previous element on pressing the UP arrow', () => {
    const triggerText = 'click me to open';

    const { getByText, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(getByTestId('dropdown--trigger'));

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });
    });

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_UP,
        code: KEY_UP,
      });
    });
    requestAnimationFrame.step();

    expect(getByText('Move').closest('button')).toHaveFocus();
  });

  it('should skip over disabled items while keyboard navigating', () => {
    const triggerText = 'click me to open';

    const { getByText, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem isDisabled>First</DropdownItem>
          <DropdownItem>Second</DropdownItem>
          <DropdownItem isDisabled={true}>Skip this</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
          <DropdownItem>Second Last</DropdownItem>
          <DropdownItem isDisabled>Last</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(getByTestId('dropdown--trigger'));

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });
    });

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });
    });

    requestAnimationFrame.step();

    expect(getByText('Delete').closest('button')).toHaveFocus();

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_UP,
        code: KEY_UP,
      });
    });
    requestAnimationFrame.step();

    expect(getByText('Second').closest('button')).toHaveFocus();

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_END,
        code: KEY_END,
      });
    });
    requestAnimationFrame.step();

    expect(getByText('Second Last').closest('button')).toHaveFocus();

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_HOME,
        code: KEY_HOME,
      });
    });
    requestAnimationFrame.step();

    expect(getByText('Second').closest('button')).toHaveFocus();
  });

  it('should skip disabled elements and focus on the first focusable element with autoFucus', () => {
    const triggerText = 'click me to open';

    const { getByText, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown" autoFocus>
        <DropdownItemGroup>
          <DropdownItem isDisabled>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(getByTestId('dropdown--trigger'));
    expect(getByText('Clone').closest('button')).toHaveFocus();
  });

  it('should skip disabled elements and focus on the first focusable element with keyboard navigation', () => {
    const triggerText = 'click me to open';

    const { getByText, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem isDisabled>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithKeydown(getByTestId('dropdown--trigger'));
    expect(getByText('Clone').closest('button')).toHaveFocus();
  });

  it('should focus the first element on pressing the HOME arrow', () => {
    const triggerText = 'click me to open';

    const { getByText, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(getByTestId('dropdown--trigger'));

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });
    });

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_HOME,
        code: KEY_HOME,
      });
    });
    requestAnimationFrame.step();

    expect(getByText('Move').closest('button')).toHaveFocus();
  });

  it('should focus the last element on pressing the END arrow', () => {
    const triggerText = 'click me to open';

    const { getByText, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    openDropdownWithClick(getByTestId('dropdown--trigger'));

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });
    });

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_END,
        code: KEY_END,
      });
    });

    requestAnimationFrame.step();

    expect(getByText('Delete').closest('button')).toHaveFocus();
  });

  it('should not let the focus loop to the last element', () => {
    const triggerText = 'click me to open';

    const { getByText, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );

    // Open the menu and bring focus to the first element be focused
    openDropdownWithKeydown(getByTestId('dropdown--trigger'));

    expect(getByText('Move').closest('button')).toHaveFocus();

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_UP,
        code: KEY_UP,
      });
    });
    requestAnimationFrame.step();

    // Assert that the focus hasn't looped over to the last element
    expect(getByText('Move').closest('button')).toHaveFocus();
  });

  it('should not let the focus loop on the first element', () => {
    const triggerText = 'click me to open';

    const { getByText, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );

    // Open menu and assert first element is focused
    openDropdownWithKeydown(getByTestId('dropdown--trigger'));
    expect(getByText('Move').closest('button')).toHaveFocus();

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_UP,
        code: KEY_UP,
      });
    });
    requestAnimationFrame.step();

    // Assert that the focus hasn't looped over to the last element
    expect(getByText('Move').closest('button')).toHaveFocus();
  });

  it('should not let the focus loop to the first element', () => {
    const triggerText = 'click me to open';

    const { getByText, getByTestId } = render(
      <DropdownMenu trigger={triggerText} testId="dropdown">
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );
    // Open menu and assert first element is focused
    openDropdownWithKeydown(getByTestId('dropdown--trigger'));
    expect(getByText('Move').closest('button')).toHaveFocus();

    // Bring the focus to the last element
    fireEvent.keyDown(getByTestId('dropdown--trigger'), {
      key: KEY_END,
      code: KEY_END,
    });
    requestAnimationFrame.step();

    fireEvent.keyDown(getByTestId('dropdown--trigger'), {
      key: KEY_DOWN,
      code: KEY_DOWN,
    });
    // Assert that the focus hasn't looped over to the first element
    expect(getByText('Delete').closest('button')).toHaveFocus();
  });

  it('should not allow the dropdown to reopen if the trigger is activated again', () => {
    const onOpenChange = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <DropdownMenu testId="dropdown" onOpenChange={onOpenChange}>
        <DropdownItemGroup>
          <DropdownItem>Move</DropdownItem>
          <DropdownItem>Clone</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>,
    );

    openDropdownWithKeydown(getByTestId('dropdown--trigger'));
    expect(queryByTestId('dropdown--content')).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith({
      isOpen: true,
      event: expect.any(KeyboardEvent),
    });
    expect(onOpenChange).toHaveBeenCalledTimes(1);

    onOpenChange.mockClear();

    // this should not be possible to do as focus should not be able
    // to go back to the trigger when the menu is open, but checking here to be safe
    openDropdownWithKeydown(getByTestId('dropdown--trigger'));
    expect(queryByTestId('dropdown--content')).toBeInTheDocument();
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
    ffTest(
      'platform.design-system-team.layering_qmiw3',
      // Test when true
      () => {
        const { getByTestId } = render(<NestedDropdown />);
        let level = 0;
        while (level < 3) {
          // test nested dropdown can be opened correctly
          const nestedTrigger = getByTestId(`nested-${level}--trigger`);
          expect(nestedTrigger).toBeInTheDocument();
          openDropdownWithKeydown(nestedTrigger);
          level += 1;
        }
        const nestedTrigger = getByTestId(`nested-${level}--trigger`);
        expect(nestedTrigger.closest('button')).toHaveFocus();
        // test on arrow navigation
        fireEvent.keyDown(window, {
          key: KEY_DOWN,
          code: KEY_DOWN,
        });
        const nestedItem1 = getByTestId(`nested-item1-${level}`);
        expect(nestedItem1.closest('button')).toHaveFocus();

        fireEvent.keyDown(window, {
          key: KEY_DOWN,
          code: KEY_DOWN,
        });
        const nestedItem2 = getByTestId(`nested-item2-${level}`);
        expect(nestedItem2.closest('button')).toHaveFocus();

        fireEvent.keyDown(window, {
          key: KEY_UP,
          code: KEY_UP,
        });
        expect(nestedItem1.closest('button')).toHaveFocus();
      },
      () => {
        const { getByTestId } = render(<NestedDropdown />);
        // test nested dropdown can be opened correctly
        const nestedTrigger = getByTestId('nested-0--trigger');
        expect(nestedTrigger).toBeInTheDocument();
        openDropdownWithKeydown(nestedTrigger);
        const nestedItem1 = getByTestId('nested-1--trigger');
        expect(nestedItem1.closest('button')).toHaveFocus();
      },
    );
  });
});
