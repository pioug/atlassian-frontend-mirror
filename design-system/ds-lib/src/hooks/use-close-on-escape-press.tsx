import { useCallback, useEffect, useRef } from 'react';

import { bindAll } from 'bind-event-listener';

import { ESCAPE } from '../utils/keycodes';

interface UseCloseOnEscapePressOpts {
	onClose: (e: KeyboardEvent) => void;
	isDisabled?: boolean;
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
 */
export default function useCloseOnEscapePress({
	onClose,
	isDisabled,
}: UseCloseOnEscapePressOpts): void {
	const escapePressed = useRef(false);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (isDisabled || escapePressed.current || e.key !== ESCAPE) {
				// We're either already handling the key down event or it's not escape.
				// Bail early!
				return;
			}

			escapePressed.current = true;
			onClose(e);
		},
		[onClose, isDisabled],
	);

	const onKeyUp = useCallback(() => {
		escapePressed.current = false;
	}, []);

	useEffect(() => {
		// Don't attach document event listeners if the hook is disabled
		if (isDisabled) {
			return;
		}

		return bindAll(
			document,
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
	}, [onKeyDown, onKeyUp, isDisabled]);
}
