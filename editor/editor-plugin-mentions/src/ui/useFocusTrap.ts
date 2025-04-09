/**
 * Custom hook to add focus trap
 * used for focus trap in ReactionPicker
 * copied from useFocusManager in @atlaskit/popup
 */
import { useEffect } from 'react';

import createFocusTrap from 'focus-trap';

export type FocusManagerHook = {
	targetRef: HTMLDivElement | null;
};

export const useFocusTrap = ({ targetRef }: FocusManagerHook): void => {
	useEffect(() => {
		if (!targetRef) {
			return;
		}

		const trapConfig = {
			clickOutsideDeactivates: true,
			escapeDeactivates: true,
			initialFocus: targetRef,
			fallbackFocus: targetRef,
			returnFocusOnDeactivate: true,
		};

		const focusTrap = createFocusTrap(targetRef, trapConfig);

		// wait for the popup to reposition itself before we focus
		let frameId: number | null = requestAnimationFrame(() => {
			frameId = null;
			focusTrap.activate();
		});

		return () => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
				frameId = null;
			}
			focusTrap.deactivate();
		};
	}, [targetRef]);
};
