import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import Button from '../../index';

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
  {
    eventName: 'click',
    reactEventName: 'onClick',
  },
  {
    eventName: 'click',
    reactEventName: 'onClickCapture',
  },
];

bindings.forEach((binding: Binding) => {
  it(`should pass through event: [${binding.eventName}]`, () => {
    const buttonHandler = { [binding.reactEventName]: jest.fn() };

    // initially not disabled to validate binding
    const { getByTestId } = render(
      <AnalyticsListener onEvent={() => {}}>
        <Button testId="button" href="http://google.com" {...buttonHandler}>
          Hello
        </Button>
      </AnalyticsListener>,
    );
    const button: HTMLElement = getByTestId('button');

    const firstEvent: Event = new Event(binding.eventName, {
      bubbles: true,
      cancelable: true,
    });
    fireEvent(button, firstEvent);

    expect(buttonHandler[binding.reactEventName]).toHaveBeenCalled();
  });
});
