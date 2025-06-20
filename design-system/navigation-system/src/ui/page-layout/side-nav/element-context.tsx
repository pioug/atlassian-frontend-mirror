import React, { createContext, type ReactNode, useContext, useRef } from 'react';

const SideNavRefContext = createContext<React.RefObject<HTMLDivElement>>({ current: null });

export function SideNavElementProvider({ children }: { children: ReactNode }) {
	const sideNavRef = useRef<HTMLDivElement>(null);

	return <SideNavRefContext.Provider value={sideNavRef}>{children}</SideNavRefContext.Provider>;
}

/**
 * Returns a ref for the side navigation that is accessible to other Page Layout slots.
 *
 * Used by the Panel to measure the SideNav when it is calculating its resize bounds.
 */
export function useSideNavRef() {
	return useContext(SideNavRefContext);
}
