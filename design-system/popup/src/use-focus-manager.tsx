import { useEffect } from 'react';

import createFocusTrap, { FocusTrap } from 'focus-trap';

import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { FocusManagerHook } from './types';

export const useFocusManager = ({
  initialFocusRef,
  popupRef,
}: FocusManagerHook): void => {
  useEffect(() => {
    if (!popupRef) {
      return noop;
    }

    let previouslyFocusedElement: HTMLElement | null;
    let focusTrap: FocusTrap;

    if (
      getBooleanFF(
        'platform.design-system-team.remove-focus-trap-from-popup_3q7sk',
      )
    ) {
      previouslyFocusedElement = document.activeElement as HTMLElement | null;
    } else {
      const trapConfig = {
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
        initialFocus: initialFocusRef || popupRef,
        fallbackFocus: popupRef,
        returnFocusOnDeactivate: true,
      };

      focusTrap = createFocusTrap(popupRef, trapConfig);
    }

    let frameId: number | null = null;

    // wait for the popup to reposition itself before we focus
    frameId = requestAnimationFrame(() => {
      frameId = null;
      if (
        getBooleanFF(
          'platform.design-system-team.remove-focus-trap-from-popup_3q7sk',
        )
      ) {
        if (initialFocusRef && initialFocusRef.focus) {
          initialFocusRef.focus();
        } else {
          popupRef.focus();
        }
      } else {
        focusTrap.activate();
      }
    });

    return () => {
      if (frameId != null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (
        getBooleanFF(
          'platform.design-system-team.remove-focus-trap-from-popup_3q7sk',
        )
      ) {
        if (previouslyFocusedElement && previouslyFocusedElement.focus) {
          previouslyFocusedElement.focus();
        }
      } else {
        focusTrap.deactivate();
      }
    };
  }, [popupRef, initialFocusRef]);
};
