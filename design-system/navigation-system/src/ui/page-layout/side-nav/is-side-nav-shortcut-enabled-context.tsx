import React, { createContext, useContext } from 'react';

/**
 * Context for whether the side nav toggle shortcut is enabled.
 *
 * Used to share the `isSideNavShortcutEnabled` prop value from `Root` with other components,
 * so the visual keyboard shortcut in tooltips can be conditionally displayed.
 */
const IsSideNavShortcutEnabledContext = createContext<boolean>(false);

/**
 * Provider for the `IsSideNavShortcutEnabledContext`.
 */
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

/**
 * Returns the value of the `isSideNavShortcutEnabled` prop from the `Root` component, which
 * is shared through context.
 */
export function useIsSideNavShortcutEnabled() {
	return useContext(IsSideNavShortcutEnabledContext);
}
