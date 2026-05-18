import { useCallback, useContext } from 'react';

import { bind } from 'bind-event-listener';
import { flushSync } from 'react-dom';

import { fg } from '@atlaskit/platform-feature-flags';

import { SetSideNavVisibilityState } from './set-side-nav-visibility-state';
import { type SideNavTrigger } from './types';
import { useSideNavRef } from './use-side-nav-ref';

type ExpandSideNav = () => void;

type UseExpandSideNavOptions = {
	trigger?: SideNavTrigger;
};

/**
 * Moves focus to the first focusable item in the side nav, or the side nav element itself as a fallback.
 */
function focusFirstNavItem(sideNavElement: HTMLElement) {
	/**
	 * Try to get the first focusable item in the side nav.
	 * The selector is not very broad, but should be appropriate for items from this package.
	 */
	const firstNavItem = sideNavElement.querySelector<HTMLElement>('a, button');

	const isFirstNavItemVisible =
		firstNavItem !== null && (firstNavItem.checkVisibility?.() ?? false);

	const itemToFocus = isFirstNavItemVisible ? firstNavItem : sideNavElement;

	if (itemToFocus === sideNavElement) {
		/**
		 * Elements without an explicit `tabindex` attribute are not guaranteed to be focusable:
		 * https://html.spec.whatwg.org/multipage/interaction.html#attr-tabindex
		 *
		 * Our slots are not interactive, so this is required.
		 *
		 * In the future we may want to check if there is an existing `tabindex` attribute,
		 * as custom skip linked elements might already have one.
		 */
		sideNavElement.setAttribute('tabindex', '-1');

		/**
		 * Cleanup the `tabindex` attribute we set when the slot or custom target loses focus.
		 *
		 * This is preferable to always having `tabindex="-1"` because always applying the tab index can:
		 *
		 * - mess with click events
		 * - potentially cause a focus ring to be always visible
		 */
		bind(sideNavElement, {
			type: 'blur',
			listener() {
				sideNavElement.removeAttribute('tabindex');
			},
			options: { once: true },
		});
	}

	/**
	 * Not using `focusVisible` option because we don't want clicks on the toggle button to show a focus ring.
	 */
	itemToFocus.focus();
}

const triggersWithFocusOnExpand = new Set<SideNavTrigger>(['toggle-button', 'skip-link']);

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
	const sideNavRef = useSideNavRef();

	const expandSideNav = useCallback(() => {
		const { matches: isDesktop } = window.matchMedia('(min-width: 64rem)');

		const runUpdate = () => {
			if (isDesktop) {
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
		};

		if (
			triggersWithFocusOnExpand.has(trigger) &&
			fg('platform_dst_nav4_skip_link_a11y_1')
		) {
			flushSync(runUpdate);
			const sideNavElement = sideNavRef.current;
			if (sideNavElement) {
				focusFirstNavItem(sideNavElement);
			}
		} else {
			runUpdate();
		}
	}, [setSideNavState, sideNavRef, trigger]);

	return expandSideNav;
}
