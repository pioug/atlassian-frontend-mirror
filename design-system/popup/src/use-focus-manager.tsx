import { useEffect } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-third-party-focus-traps -- existing usage from before this rule was added
import createFocusTrap, { type FocusTrap } from 'focus-trap';

import noop from '@atlaskit/ds-lib/noop';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type FocusManagerHook } from './types';
import { useAnimationFrame } from './utils/use-animation-frame';

export const useFocusManager = ({
	initialFocusRef,
	popupRef,
	triggerRef,
	shouldCloseOnTab,
	shouldReturnFocus,
}: FocusManagerHook): void => {
	const { requestFrame, cancelAllFrames } = useAnimationFrame();

	useEffect(() => {
		if (!popupRef || shouldCloseOnTab) {
			return noop;
		}

		const trapConfig = {
			clickOutsideDeactivates: true,
			escapeDeactivates: fg('platform_dst_nested_escape') ? false : true,
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
			if (shouldReturnFocus) {
				requestFrame(() => {
					if (
						triggerRef?.isConnected &&
						(document.activeElement === document.body ||
							document.activeElement === document.documentElement ||
							!document.activeElement)
					) {
						triggerRef.focus();
					}
				});
			}
		};
	}, [
		popupRef,
		triggerRef,
		initialFocusRef,
		shouldCloseOnTab,
		requestFrame,
		cancelAllFrames,
		shouldReturnFocus,
	]);
};
