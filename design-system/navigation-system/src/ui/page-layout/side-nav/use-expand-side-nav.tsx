import { useCallback, useContext } from 'react';

import invariant from 'tiny-invariant';

import { SetSideNavVisibilityState } from './visibility-context';

type ExpandSideNav = () => void;

/**
 * __useExpandSideNav__
 *
 * Returns a function that will expand the side nav when called.
 *
 * It will switch the appropriate internal desktop or mobile side nav visibility state based on the current screen size.
 *
 * If you need a function to toggle the side nav, use `useToggleSideNav` instead.
 */
export function useExpandSideNav(): ExpandSideNav {
	const setSideNavState = useContext(SetSideNavVisibilityState);

	const expandSideNav = useCallback(() => {
		const { matches } = window.matchMedia('(min-width: 64rem)');
		if (matches) {
			setSideNavState((currentState) => {
				invariant(currentState, 'Side nav state should not be null');

				// Skip the re-render if it's a no-op change
				if (currentState.desktop === 'expanded' && currentState.flyout === 'closed') {
					return currentState;
				}

				return {
					mobile: currentState.mobile,
					desktop: 'expanded',
					flyout: 'closed',
				};
			});
		} else {
			setSideNavState((currentState) => {
				invariant(currentState, 'Side nav state should not be null');

				// Skip the re-render if it's a no-op change
				if (currentState.mobile === 'expanded' && currentState.flyout === 'closed') {
					return currentState;
				}

				return {
					desktop: currentState.desktop,
					mobile: 'expanded',
					flyout: 'closed',
				};
			});
		}
	}, [setSideNavState]);

	return expandSideNav;
}
