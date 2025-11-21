import React, { useState } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type { SideNavState } from './types';
import { SetSideNavVisibilityState, SideNavVisibilityState } from './visibility-context';

/**
 * Manages the side nav visibility state and provides the context.
 */
export const SideNavVisibilityProvider = ({
	children,
	defaultCollapsed,
}: {
	children: React.ReactNode;
	defaultCollapsed?: boolean;
}): React.JSX.Element => {
	const initialState: SideNavState | null =
		typeof defaultCollapsed === 'boolean' && fg('platform_dst_nav4_side_nav_default_collapsed_api')
			? {
					desktop: defaultCollapsed ? 'collapsed' : 'expanded',
					mobile: 'collapsed',
					flyout: 'closed',
					lastTrigger: null,
				}
			: null;

	// Defaults to null so we can determine if the value has been set yet (for SSR)
	const [sideNavState, setSideNavState] = useState<SideNavState | null>(initialState);

	return (
		<SideNavVisibilityState.Provider value={sideNavState}>
			<SetSideNavVisibilityState.Provider value={setSideNavState}>
				{children}
			</SetSideNavVisibilityState.Provider>
		</SideNavVisibilityState.Provider>
	);
};
