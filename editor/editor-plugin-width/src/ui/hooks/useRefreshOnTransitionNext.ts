import { useEffect, useState } from 'react';

import { bindAll } from 'bind-event-listener';

// List of names for transition end events across browsers, plus `transitioncancel`: an
// interrupted transition never fires `transitionend`, so where the interruption settles the
// element at its final width that width would otherwise be missed.
const transitionEventNames = [
	'transitionend',
	'oTransitionEnd',
	'webkitTransitionEnd',
	'transitioncancel',
] as 'transitionend'[];

/**
 * Counts `full-width` <-> `full-page` transitions so callers can re-measure when one completes.
 *
 * Selected by `platform_editor_reduce_forced_layout` via `useResizeWidthObserverNext`; on cleanup,
 * rename this over `useRefreshOnTransition`.
 *
 * Differs from `useRefreshWidthOnTransition` in that it returns a counter rather than nothing, and
 * that it also listens for `transitioncancel`. The legacy hook re-measures on every render, so it
 * picks up an interrupted transition's final width incidentally; keying off a counter means the
 * cancel has to be observed explicitly.
 */
export const useRefreshWidthOnTransitionNext: (containerElement: HTMLElement | null) => number = (
	containerElement,
) => {
	const [widthTransitionCount, setWidthTransitionCount] = useState(0);

	useEffect(() => {
		if (!containerElement) {
			return;
		}
		/**
		 * Update the plugin components once the transition
		 * to full width / default mode completes
		 */
		const forceComponentUpdate = (event: TransitionEvent) => {
			// Only trigger an update if the transition is on a property containing `width`
			// This will cater for media and the content area itself currently.
			if (event.propertyName.includes('width')) {
				setWidthTransitionCount((count) => count + 1);
			}
		};

		return bindAll(
			containerElement,
			transitionEventNames.map((name) => ({
				type: name,
				listener: forceComponentUpdate,
			})),
		);
	}, [containerElement]);

	return widthTransitionCount;
};
