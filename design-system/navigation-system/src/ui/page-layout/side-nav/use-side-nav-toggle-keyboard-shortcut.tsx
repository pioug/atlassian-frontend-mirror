import { useEffect } from 'react';

import { bind } from 'bind-event-listener';

import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import { useOpenLayerObserver } from '@atlaskit/layering/use-open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { hasOpenDialogOrPopover } from '@atlaskit/top-layer/page-surface/has-open-dialog-or-popover';
import { requestClosePopovers } from '@atlaskit/top-layer/page-surface/request-close-popovers';

import { useIsSideNavShortcutEnabled } from './use-is-side-nav-shortcut-enabled';
import { useToggleSideNav } from './use-toggle-side-nav';

/**
 * Binds the keyboard shortcut to toggle the side nav.
 */
export function useSideNavToggleKeyboardShortcut({
	canToggleWithShortcut,
}: {
	canToggleWithShortcut?: () => boolean;
}): void {
	const openLayerObserver = useOpenLayerObserver({ isEnabled: !fg('platform-dst-top-layer') });
	const toggleVisibilityByShortcut = useToggleSideNav({ trigger: 'keyboard' });

	const canToggleWithShortcutStableRef = useStableRef(canToggleWithShortcut);
	const isSideNavShortcutEnabled = useIsSideNavShortcutEnabled();

	useEffect(() => {
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

					if (fg('platform-dst-top-layer') && hasOpenDialogOrPopover({ type: 'modal' })) {
						// Return early if there are any open modal dialogs
						return;
					}

					if (openLayerObserver && openLayerObserver.getCount({ type: 'modal' }) > 0) {
						// Return early if there are any open modals
						return;
					}

					// Not gated. Top-layer tooltips (`platform-dst-top-layer-tooltip`) are not known to the observer.
					requestClosePopovers();
					openLayerObserver?.closeLayers();

					toggleVisibilityByShortcut();
				}
			},
		});
	}, [
		canToggleWithShortcutStableRef,
		isSideNavShortcutEnabled,
		openLayerObserver,
		toggleVisibilityByShortcut,
	]);
}
