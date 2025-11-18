import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import { useOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags';

import { useIsFhsEnabled } from '../../fhs-rollout/use-is-fhs-enabled';

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
	const isFhsEnabled = fg('navx-2566-implement-fhs-rollout')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useIsFhsEnabled()
		: fg('navx-full-height-sidebar');

	const openLayerObserver = useOpenLayerObserver();
	const toggleVisibilityByShortcut = useToggleSideNav({ trigger: 'keyboard' });

	const canToggleWithShortcutStableRef = useStableRef(canToggleWithShortcut);
	const isSideNavShortcutEnabled = useIsSideNavShortcutEnabled();

	useEffect(() => {
		if (!isFhsEnabled) {
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

					if (openLayerObserver && openLayerObserver.getCount({ type: 'modal' }) > 0) {
						// Return early if there are any open modals
						return;
					}

					toggleVisibilityByShortcut();
				}
			},
		});
	}, [
		canToggleWithShortcutStableRef,
		isFhsEnabled,
		isSideNavShortcutEnabled,
		openLayerObserver,
		toggleVisibilityByShortcut,
	]);
}
