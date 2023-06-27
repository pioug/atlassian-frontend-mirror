import { useEffect } from 'react';

import { createFocusTrap, FocusTrap } from 'focus-trap';
import createFocusTrapV2, { FocusTrap as FocusTrapV2 } from 'focus-trap-v2';

import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { FocusManagerHook } from './types';

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

    let focusTrap: FocusTrap | FocusTrapV2;
    if (getBooleanFF('platform.design-system-team.focus-trap-upgrade_p2cei')) {
      focusTrap = createFocusTrap(popupRef, trapConfig);
    } else {
      focusTrap = createFocusTrapV2(popupRef, trapConfig);
    }

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
