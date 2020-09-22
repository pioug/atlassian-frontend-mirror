import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Button from '../../index';

const types: React.ElementType[] = ['button', 'a', 'span'];

types.forEach((tag: React.ElementType) => {
  describe(`has overlay [type: <${tag}>]`, () => {
    it('should set data-has-overlay to true if there is an overlay', () => {
      const { getByTestId, rerender } = render(
        <Button testId="button" component={tag}>
          Hello
        </Button>,
      );
      const button: HTMLElement = getByTestId('button');

      expect(button.tagName.toLowerCase()).toBe(tag);
      expect(button.hasAttribute('data-has-overlay')).toBe(false);

      rerender(
        <Button testId="button" component={tag} overlay="true">
          Hello
        </Button>,
      );

      expect(button.getAttribute('data-has-overlay')).toBe('true');
    });

    it('should allow focus', () => {
      const { getByTestId } = render(
        <Button testId="button" overlay="foo" component={tag}>
          Hello
        </Button>,
      );
      const button: HTMLElement = getByTestId('button');

      expect(button.tabIndex).toBe(0);
    });

    it('should not loose focus when overlay added', () => {
      const { getByTestId, rerender } = render(
        <Button testId="button" component={tag}>
          Hello
        </Button>,
      );
      const button: HTMLElement = getByTestId('button');

      button.focus();
      expect(button).toBe(document.activeElement);

      rerender(
        <Button testId="button" overlay="hey" component={tag}>
          Hello
        </Button>,
      );

      expect(button).toBe(document.activeElement);
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
        expect(button.hasAttribute('data-has-overlay')).toBe(false);

        const firstEventAllowed: boolean = fireEvent(
          button,
          new Event(binding.eventName, {
            bubbles: true,
            cancelable: true,
          }),
        );

        expect(buttonHandler[binding.reactEventName]).toHaveBeenCalled();
        expect(parentHandler[binding.reactEventName]).toHaveBeenCalled();
        // always preventing default on mousedown
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
              overlay="hey"
              {...buttonHandler}
            >
              Hello
            </Button>
          </div>,
        );
        // not 'disabled'
        expect(button.hasAttribute('disabled')).toBe(false);
        expect(button.getAttribute('data-has-overlay')).toBe('true');

        const secondEvent: Event = new Event(binding.eventName, {
          bubbles: true,
          cancelable: true,
        });
        const secondEventAllowed: boolean = fireEvent(button, secondEvent);

        expect(secondEventAllowed).toBe(false);
        expect(parentHandler[binding.reactEventName]).not.toHaveBeenCalled();
        expect(buttonHandler[binding.reactEventName]).not.toHaveBeenCalled();
      });
    });
  });
});

it('should remove a href attribute there is an overlay', () => {
  const { getByTestId, rerender } = render(
    <Button testId="button" href="http://foo.com">
      Hello
    </Button>,
  );
  const button: HTMLElement = getByTestId('button');

  expect(button.hasAttribute('href')).toBe(true);
  expect(button.tagName.toLowerCase()).toBe('a');

  rerender(
    <Button testId="button" href="http://foo.com" overlay="hey">
      Hello
    </Button>,
  );

  expect(button.hasAttribute('href')).toBe(false);
});
