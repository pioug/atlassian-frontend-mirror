import { useCallback, useContext } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SetSideNavVisibilityState } from './set-side-nav-visibility-state';
import { SideNavVisibilityState } from './side-nav-visibility-state';
import { type SideNavTrigger } from './types';
import { useExpandSideNav } from './use-expand-side-nav';

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
	const sideNavState = useContext(SideNavVisibilityState);

	const expandSideNav = useExpandSideNav({ trigger });

	const isCollapsedOnDesktop = sideNavState?.desktop === 'collapsed';
	const isCollapsedOnMobile = sideNavState?.mobile === 'collapsed';

	const toggleSideNav = useCallback(() => {
		const { matches: isDesktop } = window.matchMedia('(min-width: 64rem)');

		if (fg('platform_dst_nav4_skip_link_a11y_1')) {
			const isExpanding = isDesktop ? isCollapsedOnDesktop : isCollapsedOnMobile;

			if (isExpanding) {
				expandSideNav();
			} else {
				setSideNavState((currentState) => {
					// No-op if the side nav state has not been initialised yet
					// e.g. if the SideNav has not been mounted yet
					if (!currentState) {
						return null;
					}

					return {
						mobile: isDesktop ? currentState.mobile : 'collapsed',
						desktop: isDesktop ? 'collapsed' : currentState.desktop,
						flyout: 'closed',
						lastTrigger: trigger,
					};
				});
			}
			return;
		}

		if (isDesktop) {
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
	}, [expandSideNav, isCollapsedOnDesktop, isCollapsedOnMobile, setSideNavState, trigger]);

	return toggleSideNav;
}
