import React, { type ReactNode, useRef } from 'react';

import { SideNavRefContext } from './side-nav-ref-context';

export function SideNavElementProvider({ children }: { children: ReactNode }): React.JSX.Element {
	const sideNavRef = useRef<HTMLDivElement>(null);

	return <SideNavRefContext.Provider value={sideNavRef}>{children}</SideNavRefContext.Provider>;
}
