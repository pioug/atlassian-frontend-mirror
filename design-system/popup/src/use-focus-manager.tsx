import { useEffect } from 'react';

import createFocusTrap, { FocusTrap } from 'focus-trap';

import noop from '@atlaskit/ds-lib/noop';

import { FocusManagerHook } from './types';

export const useFocusManager = ({
  initialFocusRef,
  popupRef,
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

    const focusTrap: FocusTrap = createFocusTrap(popupRef, trapConfig);

    let frameId: number | null = null;

    // wait for the popup to reposition itself before we focus
    frameId = requestAnimationFrame(() => {
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
