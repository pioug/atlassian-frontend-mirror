import React from 'react';

import { IsSideNavShortcutEnabledContext } from './is-side-nav-shortcut-enabled-context';

export function IsSideNavShortcutEnabledProvider({
	children,
	isSideNavShortcutEnabled,
}: {
	children: React.ReactNode;
	isSideNavShortcutEnabled: boolean;
}): React.JSX.Element {
	return (
		<IsSideNavShortcutEnabledContext.Provider value={isSideNavShortcutEnabled}>
			{children}
		</IsSideNavShortcutEnabledContext.Provider>
	);
}
