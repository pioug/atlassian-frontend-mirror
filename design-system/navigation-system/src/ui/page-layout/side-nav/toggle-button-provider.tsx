import React, { useState } from 'react';

import { SideNavToggleButtonAttachRef, SideNavToggleButtonElement } from './toggle-button-context';

/**
 * Provider for the side nav toggle button contexts.
 *
 * We are using a [ref callback](https://react.dev/reference/react-dom/components/common#ref-callback) along with a state
 * for storing the button element once it has mounted, so that the side nav can bind event listeners to the button
 * once it is mounted.
 *
 * Otherwise, the side nav can be mounted before the button (e.g. if the button is lazy loaded), which would prevent the
 * event listeners from being set up.
 *
 * State is required as opposed to just a ref so that the effects in the side nav can react the element actually being mounted,
 * as ref values cannot be added as effect dependencies.
 */
export const SideNavToggleButtonProvider = ({ children }: { children: React.ReactNode }) => {
	const [element, setElement] = useState<HTMLButtonElement | null>(null);

	return (
		<SideNavToggleButtonElement.Provider value={element}>
			<SideNavToggleButtonAttachRef.Provider value={setElement}>
				{children}
			</SideNavToggleButtonAttachRef.Provider>
		</SideNavToggleButtonElement.Provider>
	);
};
