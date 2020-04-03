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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // second call needed for IE compatability
        focusTrap.activate();
      });
    });

    return () => {
      focusTrap.deactivate();
    };
  }, [popupRef, initialFocusRef]);
};
