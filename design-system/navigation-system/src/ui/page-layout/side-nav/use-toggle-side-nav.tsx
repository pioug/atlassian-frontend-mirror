import { useCallback, useContext } from 'react';

import { type SideNavTrigger } from './types';
import { SetSideNavVisibilityState } from './visibility-context';

type ToggleSideNav = () => void;

type UseToggleSideNavOptions = {
	trigger?: SideNavTrigger;
};

/**
 * __useToggleSideNav__
 *
 * Returns a function to toggle the side nav visibility.
 *
 * It will toggle the appropriate internal desktop or mobile side nav visibility state based on the current screen size.
 *
 * If you need a function to make the side nav visible, use `useExpandSideNav` instead.
 */
export function useToggleSideNav({
	trigger = 'programmatic',
}: UseToggleSideNavOptions = {}): ToggleSideNav {
	const setSideNavState = useContext(SetSideNavVisibilityState);

	const toggleSideNav = useCallback(() => {
		const { matches } = window.matchMedia('(min-width: 64rem)');
		if (matches) {
			setSideNavState((currentState) => {
				// No-op if the side nav state has not been initialised yet
				// e.g. if the SideNav has not been mounted yet
				if (!currentState) {
					return null;
				}

				return {
					mobile: currentState.mobile,
					desktop: currentState.desktop === 'expanded' ? 'collapsed' : 'expanded',
					flyout: 'closed',
					lastTrigger: trigger,
				};
			});
		} else {
			setSideNavState((currentState) => {
				// No-op if the side nav state has not been initialised yet
				// e.g. if the SideNav has not been mounted yet
				if (!currentState) {
					return null;
				}

				return {
					desktop: currentState.desktop,
					mobile: currentState.mobile === 'expanded' ? 'collapsed' : 'expanded',
					flyout: 'closed',
					lastTrigger: trigger,
				};
			});
		}
	}, [setSideNavState, trigger]);

	return toggleSideNav;
}
