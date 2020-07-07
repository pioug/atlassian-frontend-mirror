import { act, fireEvent } from '@testing-library/react';

import * as raf from './raf';

export const completeAnimations = () => {
  act(() => raf.flush());
  act(() => jest.runAllTimers());
};
export const triggerTransitionEnd = (component: any) => {
  // JSDom doesn't trigger transitionend event
  // https://github.com/jsdom/jsdom/issues/1781
  act(() => {
    const transitionEndEvent = new Event('transitionend', {
      bubbles: true,
      cancelable: false,
    });
    (transitionEndEvent as any).propertyName = 'width';

    fireEvent(component, transitionEndEvent);
    completeAnimations();
  });
};
