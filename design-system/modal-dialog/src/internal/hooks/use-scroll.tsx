import { useContext } from 'react';

import { ScrollContext } from '../scroll-context';

/**
 * This returns whether or not scrolling is allowed based on the existing
 * scrolling context.
 */
export default function useScroll(): boolean {
	const shouldScrollInViewport = useContext(ScrollContext);
	if (shouldScrollInViewport == null) {
		throw Error(
			'@atlaskit/modal-dialog: Scroll context unavailable – this component needs to be a child of ModalDialog.',
		);
	}

	return shouldScrollInViewport;
}
