import React, { useState } from 'react';

import { TopNavStartAttachRef, TopNavStartElement } from './top-nav-start-context';

/**
 * Provider for the TopNavStart container element contexts.
 *
 * We are using a [ref callback](https://react.dev/reference/react-dom/components/common#ref-callback) along with a state
 * for storing the element once it has mounted, so that the side nav can bind event listeners to the element
 * once it is mounted.
 *
 * Otherwise, the side nav can be mounted before the element (e.g. if the element is lazy loaded), which would prevent the
 * event listeners from being set up.
 *
 * State is required as opposed to just a ref so that the effects in the side nav can react to the element actually being mounted,
 * as ref values cannot be added as effect dependencies.
 */
export const TopNavStartProvider = ({ children }: { children: React.ReactNode }) => {
	const [element, setElement] = useState<HTMLDivElement | null>(null);

	return (
		<TopNavStartElement.Provider value={element}>
			<TopNavStartAttachRef.Provider value={setElement}>{children}</TopNavStartAttachRef.Provider>
		</TopNavStartElement.Provider>
	);
};
