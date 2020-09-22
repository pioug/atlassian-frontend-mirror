import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Button from '../../index';

import { hasStyleRule } from './_util/style-rules';

const types: React.ElementType[] = ['button', 'a', 'span'];

types.forEach((tag: React.ElementType) => {
  describe(`disabled [type: <${tag}>]`, () => {
    // Validating behaviour
    it('should render the expected tag', () => {
      const { getByTestId } = render(
        <Button testId="button" component={tag}>
          Hello
        </Button>,
      );
      const button: HTMLElement = getByTestId('button');

      expect(button.tagName.toLowerCase()).toBe(tag);
    });

    // Normally I don't test styles. But this style is important for click blocking behaviour
    // In webkit (+Chrome) nested elements inside of a disabled button can still trigger clicks
    // But using pointer-events:none in children we are normalising the button behaviour
    it(`should ignore pointer-events on all children when disabled`, () => {
      const buttonOnClick = jest.fn();
      const { getByTestId } = render(
        <Button
          testId="button"
          isDisabled
          onClick={buttonOnClick}
          component={tag}
        >
          Hello
        </Button>,
      );
      const button: HTMLElement = getByTestId('button');

      // Not blocking pointer events on button
      expect(
        hasStyleRule(`.${button.className}`, { pointerEvents: 'none' }),
      ).toBe(false);

      // Blocking pointer events on children
      expect(
        hasStyleRule(`.${button.className} > *`, { pointerEvents: 'none' }),
      ).toBe(true);
    });

    it('should prevent focus when disabled', () => {
      const { getByTestId } = render(
        <Button testId="button" isDisabled component={tag}>
          Hello
        </Button>,
      );
      const button: HTMLElement = getByTestId('button');

      expect(button.tabIndex).toBe(-1);
    });

    it('should loose focus when disabled', () => {
      const { getByTestId, rerender } = render(
        <Button testId="button" component={tag}>
          Hello
        </Button>,
      );
      const button: HTMLElement = getByTestId('button');

      button.focus();
      expect(button).toBe(document.activeElement);

      rerender(
        <Button testId="button" isDisabled component={tag}>
          Hello
        </Button>,
      );

      expect(button).not.toBe(document.activeElement);
    });

    type Binding = {
      eventName: string;
      reactEventName: keyof React.DOMAttributes<HTMLElement>;
    };

    const bindings: Binding[] = [
      {
        eventName: 'mousedown',
        reactEventName: 'onMouseDown',
      },
      {
        eventName: 'mouseup',
        reactEventName: 'onMouseUp',
      },
      {
        eventName: 'keydown',
        reactEventName: 'onKeyDown',
      },
      {
        eventName: 'keyup',
        reactEventName: 'onKeyUp',
      },
      {
        eventName: 'touchstart',
        reactEventName: 'onTouchStart',
      },
      {
        eventName: 'touchend',
        reactEventName: 'onTouchEnd',
      },
      {
        eventName: 'pointerdown',
        reactEventName: 'onPointerDown',
      },
      {
        eventName: 'pointerup',
        reactEventName: 'onPointerUp',
      },
    ];

    bindings.forEach((binding: Binding) => {
      it(`should block and prevent [${binding.eventName}]`, () => {
        const parentHandler = { [binding.reactEventName]: jest.fn() };
        const buttonHandler = { [binding.reactEventName]: jest.fn() };

        // initially not disabled to validate binding
        const { getByTestId, rerender } = render(
          <div {...parentHandler}>
            <Button testId="button" component={tag} {...buttonHandler}>
              Hello
            </Button>
          </div>,
        );
        const button: HTMLElement = getByTestId('button');
        expect(button.hasAttribute('disabled')).toBe(false);

        const firstEventAllowed: boolean = fireEvent(
          button,
          new Event(binding.eventName, {
            bubbles: true,
            cancelable: true,
          }),
        );

        expect(buttonHandler[binding.reactEventName]).toHaveBeenCalled();
        expect(parentHandler[binding.reactEventName]).toHaveBeenCalled();
        // Always calling event.preventDefault() for mousedown
        expect(firstEventAllowed).toBe(
          binding.eventName === 'mousedown' ? false : true,
        );

        // now disabling button
        buttonHandler[binding.reactEventName].mockClear();
        parentHandler[binding.reactEventName].mockClear();
        rerender(
          <div {...parentHandler}>
            <Button
              testId="button"
              component={tag}
              isDisabled
              {...buttonHandler}
            >
              Hello
            </Button>
          </div>,
        );
        expect(button.hasAttribute('disabled')).toBe(true);

        const secondEvent: Event = new Event(binding.eventName, {
          bubbles: true,
          cancelable: true,
        });
        const secondEventAllowed: boolean = fireEvent(button, secondEvent);

        // some jsdom strangeness with disabled buttons
        if (tag !== 'button') {
          expect(secondEventAllowed).toBe(false);
          expect(parentHandler[binding.reactEventName]).not.toHaveBeenCalled();
        }

        expect(buttonHandler[binding.reactEventName]).not.toHaveBeenCalled();
      });
    });
  });
});

it('should remove a href attribute when disabled', () => {
  const { getByTestId, rerender } = render(
    <Button testId="button" href="http://foo.com">
      Hello
    </Button>,
  );
  const button: HTMLElement = getByTestId('button');

  expect(button.hasAttribute('href')).toBe(true);

  rerender(
    <Button testId="button" href="http://foo.com" isDisabled>
      Hello
    </Button>,
  );

  expect(button.hasAttribute('href')).toBe(false);
});
