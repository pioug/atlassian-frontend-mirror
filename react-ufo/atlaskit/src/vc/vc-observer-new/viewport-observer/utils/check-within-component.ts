import { fg } from '@atlaskit/platform-feature-flags/fg';

import coinflip from '../../../../coinflip';
import { cacheCleanupState } from './cache-cleanup-state';
import checkFiberWithinComponent from './check-fiber-within-component';
import { cleanupCaches } from './cleanup-caches';
import findFiberWithCache from './find-fiber-with-cache';

const OLD_DOM_WALK_MAX_LEVEL = 40;
const OLD_FIBER_WALK_MAX_LEVEL = 40;

const NEW_DOM_WALK_MAX_LEVEL = 400;
const NEW_FIBER_WALK_MAX_LEVEL = 400;

const CLEANUP_THRESHOLD = 50;

function maybeCleanup(resultCache: WeakMap<HTMLElement, boolean>) {
	cacheCleanupState.callCount++;
	if (cacheCleanupState.callCount >= CLEANUP_THRESHOLD && coinflip(0.3)) {
		cleanupCaches(resultCache);
	}
}

export default function checkWithinComponent(
	node: HTMLElement,
	targetComponentName: string,
	resultCache: WeakMap<HTMLElement, boolean>,
): { isWithin: boolean } {
	maybeCleanup(resultCache);

	if (resultCache.has(node)) {
		return { isWithin: resultCache.get(node) ?? false };
	}
	const checkedNodes: HTMLElement[] = [];

	const shouldUseBumpedWalkLevels = fg('ufo-bump-walk-levels');

	const DOM_WALK_MAX_LEVEL = shouldUseBumpedWalkLevels
		? NEW_DOM_WALK_MAX_LEVEL
		: OLD_DOM_WALK_MAX_LEVEL;

	const FIBER_WALK_MAX_LEVEL = shouldUseBumpedWalkLevels
		? NEW_FIBER_WALK_MAX_LEVEL
		: OLD_FIBER_WALK_MAX_LEVEL;

	// Always use cached fiber strategy to handle non-React elements reliably
	const { fiber, cachedResult } = findFiberWithCache(
		node,
		DOM_WALK_MAX_LEVEL,
		checkedNodes,
		shouldUseBumpedWalkLevels ? resultCache : undefined,
	);

	if (cachedResult !== undefined) {
		checkedNodes.forEach((checkedNode) => {
			resultCache.set(checkedNode, cachedResult);
		});
		return { isWithin: cachedResult };
	}

	if (!fiber) {
		checkedNodes.forEach((checkedNode) => {
			resultCache.set(checkedNode, false);
		});
		return { isWithin: false };
	}
	const isWithin = checkFiberWithinComponent(fiber, targetComponentName, FIBER_WALK_MAX_LEVEL);

	checkedNodes.forEach((checkedNode) => {
		resultCache.set(checkedNode, isWithin);
	});

	return { isWithin };
}
