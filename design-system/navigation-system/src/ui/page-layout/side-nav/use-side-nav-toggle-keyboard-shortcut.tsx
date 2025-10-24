import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import { useOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags';

import { useIsSideNavShortcutEnabled } from './is-side-nav-shortcut-enabled-context';
import { useToggleSideNav } from './use-toggle-side-nav';

/**
 * Binds the keyboard shortcut to toggle the side nav.
 */
export function useSideNavToggleKeyboardShortcut({
	canToggleWithShortcut,
}: {
	canToggleWithShortcut?: () => boolean;
}) {
	const openLayerObserver = useOpenLayerObserver();
	const toggleVisibilityByShortcut = useToggleSideNav({ trigger: 'keyboard' });

	const canToggleWithShortcutStableRef = useStableRef(canToggleWithShortcut);
	const isSideNavShortcutEnabled = useIsSideNavShortcutEnabled();

	useEffect(() => {
		if (!fg('navx-full-height-sidebar')) {
			return;
		}

		if (!isSideNavShortcutEnabled) {
			return;
		}

		return bind(window, {
			type: 'keydown',
			listener(event) {
				if (event.ctrlKey && event.key === '[') {
					if (canToggleWithShortcutStableRef.current && !canToggleWithShortcutStableRef.current()) {
						// Return early if the callback returns false.
						// If the callback is not provided, we assume the shortcut is enabled.
						return;
					}

					if (event.repeat) {
						// Ignore repeated keydown events from holding down the keys
						return;
					}

					if (
						openLayerObserver.getCount({ type: 'modal' }) > 0 &&
						fg('platform-dst-open-layer-observer-layer-type')
					) {
						// Return early if there are any open modals
						// This check is behind the layer type FG, as `getCount` will return the count of all layers when
						// the FG is disabled - meaning we would ignore the shortcut if there is any open layer (not just modals).
						return;
					}

					toggleVisibilityByShortcut();
				}
			},
		});
	}, [
		canToggleWithShortcutStableRef,
		openLayerObserver,
		toggleVisibilityByShortcut,
		isSideNavShortcutEnabled,
	]);
}
