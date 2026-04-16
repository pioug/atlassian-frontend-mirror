import React, { useContext } from 'react';

import { SideNavRefContext } from './side-nav-ref-context';

/**
 * Returns a ref for the side navigation that is accessible to other Page Layout slots.
 *
 * Used by the Panel to measure the SideNav when it is calculating its resize bounds.
 */
export function useSideNavRef(): React.RefObject<HTMLDivElement> {
	return useContext(SideNavRefContext);
}
