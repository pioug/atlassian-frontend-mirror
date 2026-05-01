import { useCallback, useEffect, useRef } from 'react';

import { bindAll } from 'bind-event-listener';

import { useLayering } from './use-layering';

const ESCAPE = 'Escape';

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
 */
export function useCloseOnEscapePress({ onClose, isDisabled }: UseCloseOnEscapePressOpts): void {
	const escapePressed = useRef(false);
	const { isLayerDisabled } = useLayering();

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
	}, [onKeyDown, onKeyUp]);
}
