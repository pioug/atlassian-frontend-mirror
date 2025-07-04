import { type MutableRefObject, useCallback, useContext, useEffect, useRef } from 'react';

import { bindAll } from 'bind-event-listener';

import { fg } from '@atlaskit/platform-feature-flags';

import { type LayerNode } from '../classes/layer-node';
import {
	LevelContext,
	LevelNodeContext,
	RootNodeContext,
	TopLevelContext,
} from '../components/layering-context';

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
export function useLayering() {
	const currentLevel = useContext(LevelContext);

	// Remove TopLevelContext on FG cleanup layering-tree-graph
	const { topLevelRef, layerList } = useContext(TopLevelContext);

	let layerNode: MutableRefObject<LayerNode | null> | undefined;
	let rootNode: MutableRefObject<LayerNode | null> | undefined;
	if (fg('layering-tree-graph')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		layerNode = useContext(LevelNodeContext);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		rootNode = useContext(RootNodeContext);
	}

	const isLayerDisabled: () => boolean = useCallback(() => {
		if (fg('layering-tree-graph')) {
			// This is an impossible case, added for type safety
			if (!layerNode?.current || !rootNode?.current) {
				return false;
			}

			return layerNode.current.getLevel() < rootNode.current.getHeight();
		}

		return (layerList?.current?.length ?? 0) !== currentLevel;
	}, [currentLevel, layerList, layerNode, rootNode]);

	const getTopLevel = useCallback(
		() => (rootNode?.current ? rootNode.current.getHeight() : null),
		[rootNode],
	);

	return fg('layering-tree-graph')
		? { currentLevel, isLayerDisabled, getTopLevel }
		: {
				currentLevel,
				topLevelRef,
				isLayerDisabled,
				layerList,
			};
}
