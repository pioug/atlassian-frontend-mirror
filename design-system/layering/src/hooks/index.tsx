import { useCallback, useContext, useEffect, useRef } from 'react';

import { bindAll } from 'bind-event-listener';

import { LevelContext, LevelNodeContext, RootNodeContext } from '../components/layering-context';

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

/**
 *
 * Layering hook to get layering info like the current level, the top level of the given component
 *
 */
export function useLayering(): {
    currentLevel: number;
    isLayerDisabled: () => boolean;
    getTopLevel: () => number | null;
} {
	const currentLevel = useContext(LevelContext);

	const layerNode = useContext(LevelNodeContext);
	const rootNode = useContext(RootNodeContext);

	const isLayerDisabled: () => boolean = useCallback(() => {
		// This is an impossible case, added for type safety
		if (!layerNode?.current || !rootNode?.current) {
			return false;
		}

		return layerNode.current.getLevel() < rootNode.current.getHeight();
	}, [layerNode, rootNode]);

	const getTopLevel = useCallback(
		() => (rootNode?.current ? rootNode.current.getHeight() : null),
		[rootNode],
	);

	return { currentLevel, isLayerDisabled, getTopLevel };
}
