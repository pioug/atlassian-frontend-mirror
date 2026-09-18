/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// Keep PlaybackSpeedControls to use static colors from the new color palette to support the hybrid
// theming in media viewer https://product-fabric.atlassian.net/browse/DSP-6067
// with the compiled react, we are leaving the static colors in tact for now.

import { getDocument } from '@atlaskit/browser-apis';
import { type State } from '@atlaskit/popper/popper';
import type { PopupSelect } from '@atlaskit/select/popup-select';

import { POPUP_OFFSET, popperProps } from './dropdownControlCommon';

/**
 * Repositions a popup-select element when the video player is in fullscreen mode.
 *
 * When fullscreen is active, the browser's Fullscreen API makes the fullscreen element
 * the containing block for `position: fixed` descendants. Popper.js computes transform
 * coordinates assuming the viewport is the containing block, which results in the popup
 * being rendered off-screen inside the fullscreen container.
 *
 * This function is called by Popper's `onFirstUpdate` callback with the Popper state,
 * which provides direct references to both the popup and trigger elements — avoiding
 * fragile DOM traversal like `previousElementSibling`.
 */
const repositionPopupInFullscreen = (state: Partial<State>) => {
	const fullscreenEl = getDocument()?.fullscreenElement;
	if (!fullscreenEl) {
		return;
	}

	const popupEl = state.elements?.popper;
	const triggerEl = state.elements?.reference;

	if (!popupEl || !triggerEl || !fullscreenEl.contains(popupEl) || !popupEl.isConnected) {
		return;
	}

	const triggerRect = triggerEl.getBoundingClientRect();
	const popupRect = popupEl.getBoundingClientRect();

	const left = Math.round(
		Math.max(
			0,
			Math.min(
				fullscreenEl.clientWidth - popupRect.width,
				triggerRect.left + triggerRect.width / 2 - popupRect.width / 2,
			),
		),
	);
	const bottom = Math.round(fullscreenEl.clientHeight - triggerRect.top + POPUP_OFFSET);

	popupEl.style.setProperty('position', 'fixed');
	popupEl.style.setProperty('inset', `auto auto ${bottom}px ${left}px`);
	popupEl.style.setProperty('transform', 'none');
};

const fullscreenPopperProps: PopupSelect['props']['popperProps'] = {
	...popperProps,
	onFirstUpdate: (state: Partial<State>) => {
		// Double rAF ensures the popup content has rendered so we get accurate dimensions
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				repositionPopupInFullscreen(state);
			});
		});
	},
};

/**
 * Returns the appropriate popperProps based on fullscreen state.
 * When in fullscreen, includes an `onFirstUpdate` callback that repositions the popup
 * after Popper's initial (incorrect) positioning.
 */

export const getPopperPropsForFullscreen = (
	isFullScreen: boolean,
): PopupSelect['props']['popperProps'] => {
	return isFullScreen ? fullscreenPopperProps : popperProps;
};
