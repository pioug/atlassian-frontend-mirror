import type { ActiveNode } from '../blockControlsPluginType';

export type BlockControlsSurfaceTarget = {
	position: number;
	source: 'active' | 'root' | 'stored';
};

/**
 * Combines hover-driven and stored surface positions into one deduplicated list.
 * Shared by both the left and right surfaces: this is pure position bookkeeping with no
 * surface-specific behavior, so there's nothing to keep independent between them. What *is*
 * kept independent is each surface's own React tree (component lookup, measurement effects,
 * observers) — see block-controls-left-surfaces.tsx / block-controls-right-surfaces.tsx.
 */
export const getBlockControlsSurfaceTargets = (
	activeNode: ActiveNode | undefined,
	storedPositions: readonly number[],
): readonly BlockControlsSurfaceTarget[] => {
	const targetsByPosition = new Map<number, BlockControlsSurfaceTarget>();

	for (const position of storedPositions) {
		targetsByPosition.set(position, {
			position,
			source: 'stored',
		});
	}

	if (activeNode) {
		const rootPosition = activeNode.rootPos ?? activeNode.pos;
		targetsByPosition.set(rootPosition, {
			position: rootPosition,
			source: 'root',
		});

		if (activeNode.pos !== rootPosition) {
			targetsByPosition.set(activeNode.pos, {
				position: activeNode.pos,
				source: 'active',
			});
		}
	}

	return Array.from(targetsByPosition.values()).sort(
		(first, second) => first.position - second.position,
	);
};
