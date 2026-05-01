import { useCallback, useContext } from 'react';

import { LevelContext } from '../components/level-context';
import { LevelNodeContext } from '../components/level-node-context';
import { RootNodeContext } from '../components/root-node-context';

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
