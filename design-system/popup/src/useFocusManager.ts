import { useEffect } from 'react';

import createFocusTrap from 'focus-trap';

import { FocusManagerHook } from './types';

const noop = () => {};

export const useFocusManager = ({
  popupRef,
  initialFocusRef,
}: FocusManagerHook): void => {
  useEffect(() => {
    if (!popupRef) {
      return noop;
    }

    const trapConfig = {
      clickOutsideDeactivates: true,
      escapeDeactivates: true,
      initialFocus: initialFocusRef || popupRef,
      fallbackFocus: popupRef,
      returnFocusOnDeactivate: true,
    };

    const focusTrap = createFocusTrap(popupRef, trapConfig);

    // wait for the popup to reposition itself before we focus
    let frameId: number | null = requestAnimationFrame(() => {
      frameId = null;
      focusTrap.activate();
    });

    return () => {
      if (frameId != null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      focusTrap.deactivate();
    };
  }, [popupRef, initialFocusRef]);
};
