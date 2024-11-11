import React, { useEffect } from 'react';

import type { PopupPosition } from '@atlaskit/editor-common/ui';

/**
 * Autofocuses the first interactive element in the first tab panel
 * when the media picker is opened.
 *
 * This is to mitigate the issue where the PopupWithListeners component
 * renders initially at the top of the editor and then repositioned.
 *
 * We want to autofocus after the repositioning to ensure we don't scroll
 * to the top of the editor when the media picker is opened.
 */
export const useUnholyAutofocus = () => {
	const autofocusRef = React.useRef<HTMLButtonElement>(null);
	const positionRef = React.useRef<PopupPosition | null>(null);

	const onPositionCalculated = React.useCallback(
		(position: PopupPosition) => {
			if (positionRef.current === null) {
				// Initial position is _always incorrect, so the first time this is set
				// we're going to ignore it.
				positionRef.current = position;
			} else if (positionRef.current !== position) {
				// If it isn't the first position and it has changed, we're likely in
				// the actual position we want. We'll call focus and update the position.
				autofocusRef.current?.focus();
				positionRef.current = position;
			}

			// Important to return this as the popup uses the returned position
			return position;
		},
		[autofocusRef],
	);

	/**
	 * If we don't clear the ref, then reopening the media picker will
	 * not correctly focus the button.
	 *
	 * WARNING: If the component re-renders the ref will be cleared and
	 * the button will be focused again.
	 *
	 * This is a trade-off, we prefer that the button is correctly focused
	 * if the media picker is re-opened, rather than re-focusing the button
	 * if the component re-renders/ the browser window is resized.
	 *
	 * This is a temporary solution until we can find a better way to do it.
	 */
	useEffect(() => {
		return () => {
			positionRef.current = null;
		};
	});

	return { autofocusRef, onPositionCalculated };
};
