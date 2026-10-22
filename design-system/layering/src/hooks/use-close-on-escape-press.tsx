import { useCallback, useEffect, useRef } from 'react';

import { bindAll } from 'bind-event-listener';

import { useLayering } from './use-layering';

const ESCAPE = 'Escape';

interface UseCloseOnEscapePressOpts {
	onClose: (e: KeyboardEvent) => void;
	isDisabled?: boolean;
	/**
	 * Set to `false` to opt out entirely (for example on a feature-gated top-layer code path). No
	 * listener is bound and the layering tree is not consulted. Defaults to `true`.
	 */
	isEnabled?: boolean;
}

/**
 * Calls back when the escape key is pressed.
 * To be used exclusively for closing layered components.
 * Use the `isDisabled` argument to ignore closing events.
 *
 * ```js
 * useCloseOnEscapePress({
 *   onClose: () => {},
 *   isDisabled: false,
 * });
 * ```
 *
 * @deprecated The browser top layer handles stacking and Escape natively. Use `@atlaskit/top-layer`
 * (DS components use it on their `platform-dst-top-layer` path). To close a page surface (for
 * example a side panel) on Escape, use `useCloseOnUnclaimedEscape` from `@atlaskit/top-layer/page-surface/use-close-on-unclaimed-escape`.
 * During the rollout, pass `isEnabled: !fg('platform-dst-top-layer')`.
 */
export function useCloseOnEscapePress({
	onClose,
	isDisabled,
	isEnabled = true,
}: UseCloseOnEscapePressOpts): void {
	const escapePressed = useRef(false);
	const { isLayerDisabled } = useLayering({ isEnabled });

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			const isDisabledLayer = isLayerDisabled();

			if (isDisabled || escapePressed.current || e.key !== ESCAPE || isDisabledLayer) {
				// We're either already handling the key down event or it's not escape or disabled.
				// Bail early!
				return;
			}

			escapePressed.current = true;
			onClose(e);
		},
		[onClose, isDisabled, isLayerDisabled],
	);

	const onKeyUp = useCallback(() => {
		escapePressed.current = false;
	}, []);

	useEffect(() => {
		if (!isEnabled) {
			return;
		}
		return bindAll(
			window,
			[
				{
					type: 'keydown',
					listener: onKeyDown,
				},
				{
					type: 'keyup',
					listener: onKeyUp,
				},
			],
			{ capture: false },
		);
	}, [isEnabled, onKeyDown, onKeyUp]);
}
