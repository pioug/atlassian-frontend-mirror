/**
 * Custom hook to add focus trap
 * used for focus trap in ReactionPicker
 * copied from useFocusManager in @atlaskit/popup
 */
import { useEffect } from 'react';

import { createFocusTrap, FocusTrap } from 'focus-trap';
import createFocusTrapV2, { FocusTrap as FocusTrapV2 } from 'focus-trap-v2';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export type FocusManagerHook = {
  targetRef: HTMLDivElement | null;
  initialFocusRef: HTMLElement | null;
};

export const useFocusTrap = ({
  targetRef,
  initialFocusRef,
}: FocusManagerHook): void => {
  useEffect(() => {
    if (!targetRef) {
      return;
    }

    const trapConfig = {
      clickOutsideDeactivates: true,
      escapeDeactivates: true,
      initialFocus: initialFocusRef || targetRef,
      fallbackFocus: targetRef,
      returnFocusOnDeactivate: false,
    };

    let focusTrap: FocusTrap | FocusTrapV2;
    if (getBooleanFF('platform.design-system-team.focus-trap-upgrade_p2cei')) {
      focusTrap = createFocusTrap(targetRef, trapConfig);
    } else {
      focusTrap = createFocusTrapV2(targetRef, trapConfig);
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
  }, [targetRef, initialFocusRef]);
};
