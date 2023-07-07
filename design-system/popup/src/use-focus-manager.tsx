import { useEffect } from 'react';

import { createFocusTrap, FocusTrap, Options } from 'focus-trap';
import createFocusTrapV2, {
  FocusTrap as FocusTrapV2,
  Options as OptionsV2,
} from 'focus-trap-v2';

import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { FocusManagerHook } from './types';

export const useFocusManager = ({
  popupRef,
  initialFocusRef,
  autoFocus,
}: FocusManagerHook): void => {
  useEffect(() => {
    if (!popupRef) {
      return noop;
    }

    let focusTrap: FocusTrapV2 | FocusTrap;

    if (getBooleanFF('platform.design-system-team.focus-trap-upgrade_p2cei')) {
      const trapConfig: Options = {
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
        // @ts-ignore: The multiple focus-trap packages is causing a type error that does not affect functionality
        initialFocus: autoFocus ? initialFocusRef || popupRef : false,
        fallbackFocus: popupRef,
        returnFocusOnDeactivate: true,
      };
      focusTrap = createFocusTrap(popupRef, trapConfig);
    } else {
      const trapConfig: OptionsV2 = {
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
        initialFocus: initialFocusRef || popupRef,
        fallbackFocus: popupRef,
        returnFocusOnDeactivate: true,
      };
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
  }, [popupRef, initialFocusRef, autoFocus]);
};
