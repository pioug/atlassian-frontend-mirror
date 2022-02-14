import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
import { replaceRaf, Stub } from 'raf-stub';

import { KEY_DOWN, KEY_END, KEY_HOME, KEY_UP } from '@atlaskit/ds-lib/keycodes';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../../index';

describe('dropdown menu keyboard navigation', () => {
  // requestAnimationFrame is replaced by raf-stub
  replaceRaf();
  const requestAnimationFrame = (window.requestAnimationFrame as unknown) as Stub;

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
      element.focus();
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

  it('should NOT open the menu when DOWN arrow is pressed after the trigger has lost focus', () => {
    const triggerText = 'click me to open';

    const { getByTestId, queryByTestId } = render(
      <>
        <button data-testId="outside" type="button" />
        <DropdownMenu trigger={triggerText} testId="dropdown">
          <DropdownItemGroup>
            <DropdownItem>Move</DropdownItem>
            <DropdownItem>Clone</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownItemGroup>
        </DropdownMenu>
      </>,
    );

    openDropdownWithKeydown(getByTestId('dropdown--trigger'));

    expect(queryByTestId('dropdown--content')).toBeInTheDocument();

    act(() => {
      getByTestId('outside').click();
      getByTestId('dropdown--trigger').blur();
    });

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });
    });

    expect(queryByTestId('dropdown--content')).not.toBeInTheDocument();
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
    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_END,
        code: KEY_END,
      });
    });
    requestAnimationFrame.step();

    act(() => {
      fireEvent.keyDown(getByTestId('dropdown--trigger'), {
        key: KEY_DOWN,
        code: KEY_DOWN,
      });
    });

    // Assert that the focus hasn't looped over to the first element
    expect(getByText('Delete').closest('button')).toHaveFocus();
  });
});
