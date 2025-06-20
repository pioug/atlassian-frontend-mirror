import { useContext } from 'react';

import { SideNavVisibilityState } from './visibility-context';

type HookArgs = {
	/**
	 * The default visibility state of the side nav on desktop screens.
	 * This value will be used if the visibility state is not set in context yet, e.g. during SSR.
	 */
	defaultCollapsed?: boolean;
};

type HookReturnValue = {
	isExpandedOnDesktop: boolean;
	isExpandedOnMobile: boolean;
};

/**
 * This hook is intended to be used internally within the `@atlaskit/navigation-system` package.
 *
 * It handles using whether to use the desktop visibility state from _context_, or the _defaultCollapsed_ arg (which comes
 * from component props) - based on whether the context has been set yet. In SSR / initial render, the context would not have been
 * set yet, so we need to use the _defaultCollapsed_ argument value instead.
 */
export const useSideNavVisibility = ({
	defaultCollapsed = false,
}: HookArgs = {}): HookReturnValue => {
	const sideNavState = useContext(SideNavVisibilityState);

	// If the context value is `null`, it means we are still in SSR, and should use the default values.
	// For desktop, it comes from the `defaultCollapsed` prop, and for mobile, it is always `false`.
	if (sideNavState === null) {
		return {
			isExpandedOnDesktop: !defaultCollapsed,
			isExpandedOnMobile: false,
		};
	}

	return {
		isExpandedOnDesktop: sideNavState.desktop === 'expanded',
		isExpandedOnMobile: sideNavState.mobile === 'expanded',
	};
};
