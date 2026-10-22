import { useCallback, useContext } from 'react';

import { LevelContext } from '../components/level-context';
import { LevelNodeContext } from '../components/level-node-context';
import { RootNodeContext } from '../components/root-node-context';

/**
 *
 * Layering hook to get layering info like the current level, the top level of the given component
 *
 * Pass `isEnabled: false` to opt out (for example on a feature-gated top-layer code path). The hook
 * then reports no layering: `currentLevel` is `0`, `isLayerDisabled()` is `false` and
 * `getTopLevel()` is `null`.
 *
 * @deprecated The browser top layer handles stacking and Escape natively. Use `@atlaskit/top-layer`
 * (DS components use it on their `platform-dst-top-layer` path). To check whether an overlay is
 * open, for example to ignore keys, use `hasOpenDialogOrPopover` from `@atlaskit/top-layer/page-surface/has-open-dialog-or-popover`.
 * During the rollout, pass `isEnabled: !fg('platform-dst-top-layer')`.
 */
export function useLayering({ isEnabled = true }: { isEnabled?: boolean } = {}): {
	currentLevel: number;
	isLayerDisabled: () => boolean;
	getTopLevel: () => number | null;
} {
	const levelFromContext = useContext(LevelContext);
	const currentLevel = isEnabled ? levelFromContext : 0;

	const layerNode = useContext(LevelNodeContext);
	const rootNode = useContext(RootNodeContext);

	const isLayerDisabled: () => boolean = useCallback(() => {
		if (!isEnabled) {
			return false;
		}
		// This is an impossible case, added for type safety
		if (!layerNode?.current || !rootNode?.current) {
			return false;
		}

		return layerNode.current.getLevel() < rootNode.current.getHeight();
	}, [isEnabled, layerNode, rootNode]);

	const getTopLevel = useCallback(() => {
		if (!isEnabled) {
			return null;
		}
		return rootNode?.current ? rootNode.current.getHeight() : null;
	}, [isEnabled, rootNode]);

	return { currentLevel, isLayerDisabled, getTopLevel };
}
