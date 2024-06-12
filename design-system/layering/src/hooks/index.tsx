import { useCallback, useContext, useEffect, useRef } from 'react';

import { bindAll } from 'bind-event-listener';

import { LevelContext, TopLevelContext } from '../components/context';

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
	const { isLayerDisabled } = UNSAFE_useLayering();

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
	}, [onKeyDown, onKeyUp]);
}

/**
 *
 * @experimental Still under development. Do not use.
 *
 * Layering hook to get layering info like the current level, the top level of
 * the given component
 *
 */
export function UNSAFE_useLayering() {
	const currentLevel = useContext(LevelContext);
	const { topLevelRef } = useContext(TopLevelContext);
	const isLayerDisabled: () => boolean = useCallback(() => {
		return !!topLevelRef.current && currentLevel !== topLevelRef.current;
	}, [currentLevel, topLevelRef]);
	return { currentLevel, topLevelRef, isLayerDisabled };
}
