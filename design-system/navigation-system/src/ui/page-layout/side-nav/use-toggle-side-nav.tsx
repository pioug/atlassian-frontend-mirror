import { useCallback, useContext } from 'react';

import invariant from 'tiny-invariant';

import { SetSideNavVisibilityState } from './visibility-context';

type ToggleSideNav = () => void;

/**
 * __useToggleSideNav__
 *
 * Returns a function to toggle the side nav visibility.
 *
 * It will toggle the appropriate internal desktop or mobile side nav visibility state based on the current screen size.
 *
 * If you need a function to make the side nav visible, use `useShowSideNav` instead.
 */
export function useToggleSideNav(): ToggleSideNav {
	const setSideNavState = useContext(SetSideNavVisibilityState);

	const toggleSideNav = useCallback(() => {
		const { matches } = window.matchMedia('(min-width: 64rem)');
		if (matches) {
			setSideNavState((currentState) => {
				invariant(currentState, 'Side nav state should not be null');

				return {
					mobile: currentState.mobile,
					desktop: currentState.desktop === 'expanded' ? 'collapsed' : 'expanded',
					flyout: 'closed',
				};
			});
		} else {
			setSideNavState((currentState) => {
				invariant(currentState, 'Side nav state should not be null');

				return {
					desktop: currentState.desktop,
					mobile: currentState.mobile === 'expanded' ? 'collapsed' : 'expanded',
					flyout: 'closed',
				};
			});
		}
	}, [setSideNavState]);

	return toggleSideNav;
}
