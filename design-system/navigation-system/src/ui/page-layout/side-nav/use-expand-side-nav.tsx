import { useCallback, useContext } from 'react';

import { type SideNavTrigger } from './types';
import { SetSideNavVisibilityState } from './visibility-context';

type ExpandSideNav = () => void;

type UseExpandSideNavOptions = {
	trigger?: SideNavTrigger;
};

/**
 * __useExpandSideNav__
 *
 * Returns a function that will expand the side nav when called.
 *
 * It will switch the appropriate internal desktop or mobile side nav visibility state based on the current screen size.
 *
 * If you need a function to toggle the side nav, use `useToggleSideNav` instead.
 */
export function useExpandSideNav({
	trigger = 'programmatic',
}: UseExpandSideNavOptions = {}): ExpandSideNav {
	const setSideNavState = useContext(SetSideNavVisibilityState);

	const expandSideNav = useCallback(() => {
		const { matches } = window.matchMedia('(min-width: 64rem)');
		if (matches) {
			setSideNavState((currentState) => {
				// No-op if the side nav state has not been initialised yet
				// e.g. if the SideNav has not been mounted yet
				if (!currentState) {
					return null;
				}

				// Skip the re-render if it's a no-op change
				if (currentState.desktop === 'expanded' && currentState.flyout === 'closed') {
					return currentState;
				}

				return {
					mobile: currentState.mobile,
					desktop: 'expanded',
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

				// Skip the re-render if it's a no-op change
				if (currentState.mobile === 'expanded' && currentState.flyout === 'closed') {
					return currentState;
				}

				return {
					desktop: currentState.desktop,
					mobile: 'expanded',
					flyout: 'closed',
					lastTrigger: trigger,
				};
			});
		}
	}, [setSideNavState, trigger]);

	return expandSideNav;
}
