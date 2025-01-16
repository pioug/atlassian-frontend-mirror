import { useEffect, useState } from 'react';

import { bindAll } from 'bind-event-listener';

// List of names for transition end events across browsers
const transitionEventNames = [
	'transitionend',
	'oTransitionEnd',
	'webkitTransitionEnd',
] as 'transitionend'[];

/**
 * We need to refresh the page if we transition due to `full-width` -> `full-page` changes
 */
export const useRefreshWidthOnTransition = (containerElement: HTMLElement | null) => {
	const [_, setLastWidthEvent] = useState<TransitionEvent | undefined>();

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
				setLastWidthEvent(event);
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
};
