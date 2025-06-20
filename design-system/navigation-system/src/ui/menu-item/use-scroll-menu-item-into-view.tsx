import { useEffect, useRef } from 'react';

import invariant from 'tiny-invariant';

import { useAreAllAncestorsExpanded } from './expandable-menu-item/expandable-menu-item-context';

type WaitingState = {
	type: 'waiting-to-be-selected-and-all-ancestors-expanded' | 'waiting-to-be-unselected';
};

function scrollMenuItemIntoView(element: HTMLDivElement): void {
	/**
	 * If [scrollIntoViewIfNeeded](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded) is available,
	 * we are using it to scroll the element into view _in the center_ of the scroll container. Because it is a non-standard method
	 * and not available on all browsers (currently not supported in Firefox), we are using it for progressive enhancement.
	 *
	 * Otherwise, we are falling back to [scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView).
	 */
	if (typeof element.scrollIntoViewIfNeeded === 'function') {
		element.scrollIntoViewIfNeeded(true);
		return;
	}

	// JSDOM does not support scrollIntoView, so defensively using it (see https://github.com/jsdom/jsdom/issues/1695)
	element.scrollIntoView?.({
		// We are using `nearest` to prevent scrolling on user interaction when the menu item is already in view.
		block: 'nearest',
	});
}

/**
 * Scrolls the element into view once it is selected, and once all its ancestors (expandable
 * parent menu items) are expanded.
 *
 * Once that has happened, we don't want to scroll it into view again until it has been unselected.
 * This is to prevent the menu item from being scrolled into view again if the user collapses a
 * parent and then expands it again, without changing what menu item is selected.
 */
export function useScrollMenuItemIntoView({
	elementRef,
	isSelected,
}: {
	elementRef: React.RefObject<HTMLDivElement>;
	isSelected: boolean;
}): void {
	const areAllAncestorsExpanded = useAreAllAncestorsExpanded();

	const waitingStateRef = useRef<WaitingState>({
		type: 'waiting-to-be-selected-and-all-ancestors-expanded',
	});

	useEffect(() => {
		if (waitingStateRef.current.type === 'waiting-to-be-selected-and-all-ancestors-expanded') {
			const shouldScroll = areAllAncestorsExpanded && isSelected;

			if (!shouldScroll) {
				return;
			}

			const element = elementRef.current;
			invariant(element, 'Element ref must be set');
			scrollMenuItemIntoView(element);

			// Now that we are scrolled the menu item into view, we need to wait for the menu item to
			// be unselected before checking again.
			waitingStateRef.current.type = 'waiting-to-be-unselected';
			return;
		}

		if (waitingStateRef.current.type === 'waiting-to-be-unselected') {
			if (!isSelected) {
				waitingStateRef.current.type = 'waiting-to-be-selected-and-all-ancestors-expanded';
			}

			return;
		}
	}, [areAllAncestorsExpanded, elementRef, isSelected]);
}
