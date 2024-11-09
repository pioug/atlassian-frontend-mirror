import { useEffect } from 'react';

import createFocusTrap, { type FocusTrap } from 'focus-trap';

import noop from '@atlaskit/ds-lib/noop';
import { useLayering } from '@atlaskit/layering';
import { fg } from '@atlaskit/platform-feature-flags';

import { type FocusManagerHook } from './types';
import { useAnimationFrame } from './utils/use-animation-frame';

export const useFocusManager = ({
	initialFocusRef,
	popupRef,
	triggerRef,
	autoFocus,
	shouldCloseOnTab,
	shouldDisableFocusTrap,
	shouldReturnFocus,
	shouldRenderToParent,
}: FocusManagerHook): void => {
	const { requestFrame, cancelAllFrames } = useAnimationFrame();
	const { currentLevel } = useLayering();

	useEffect(() => {
		if (!popupRef || shouldCloseOnTab) {
			return noop;
		}

		if (shouldDisableFocusTrap && fg('platform_dst_popup-disable-focuslock')) {
			const isDropdown = popupRef.matches('[id^=ds--dropdown--]');
			const popups = document.querySelectorAll(`[data-ds--level="${currentLevel - 1}"]`);

			if (!(popups[popups.length - 1] && !shouldRenderToParent && isDropdown)) {
				// Plucking trigger & popup content container from the tab order so that
				// when we Shift+Tab, the focus moves to the element before trigger
				requestFrame(() => {
					triggerRef?.setAttribute('tabindex', '-1');
					if (popupRef && autoFocus) {
						popupRef.setAttribute('tabindex', '-1');
					}
					(initialFocusRef || popupRef).focus();
				});
				return noop;
			}
		}

		const trapConfig = {
			clickOutsideDeactivates: true,
			escapeDeactivates: true,
			initialFocus: initialFocusRef || popupRef,
			fallbackFocus: popupRef,
			returnFocusOnDeactivate: shouldReturnFocus,
		};

		const focusTrap: FocusTrap = createFocusTrap(popupRef, trapConfig);

		// Wait for the popup to reposition itself before we focus
		requestFrame(() => {
			focusTrap.activate();
		});

		return () => {
			cancelAllFrames();
			focusTrap.deactivate();
		};
	}, [
		popupRef,
		triggerRef,
		autoFocus,
		initialFocusRef,
		shouldCloseOnTab,
		shouldDisableFocusTrap,
		requestFrame,
		cancelAllFrames,
		shouldReturnFocus,
		shouldRenderToParent,
		currentLevel,
	]);
};
