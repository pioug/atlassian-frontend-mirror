import { fg } from '@atlaskit/platform-feature-flags';

import coinflip from '../../../../coinflip';

import checkFiberWithinComponent from './check-fiber-within-component';
import findFiberWithCache from './find-fiber-with-cache';

const DEFAULT_MAX_LEVEL = 20;
const INCREASED_DOM_WALK_MAX_LEVEL = 40;

function getDomWalkMaxLevel() {
	return fg('platform_ufo_3p_detection_increase_dom_walk')
		? INCREASED_DOM_WALK_MAX_LEVEL
		: DEFAULT_MAX_LEVEL;
}

// Cache cleanup
let callCount = 0;
const CLEANUP_THRESHOLD = 50;

function maybeCleanup(resultCache: WeakMap<HTMLElement, boolean>) {
	callCount++;
	if (callCount >= CLEANUP_THRESHOLD && coinflip(0.3)) {
		cleanupCaches(resultCache);
	}
}

export function cleanupCaches(
	resultCache: WeakMap<HTMLElement, boolean>,
): WeakMap<HTMLElement, boolean> {
	resultCache = new WeakMap<HTMLElement, boolean>();
	callCount = 0;

	return resultCache;
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
	let fiber: any = null;
	let checkedNodes: HTMLElement[] = [];
	const domWalkMaxLevel = getDomWalkMaxLevel();

	// Always use cached fiber strategy to handle non-React elements reliably
	fiber = findFiberWithCache(node, domWalkMaxLevel, checkedNodes);

	if (!fiber) {
		checkedNodes.forEach((checkedNode) => {
			resultCache.set(checkedNode, false);
		});
		return { isWithin: false };
	}
	const isWithin = checkFiberWithinComponent(fiber, targetComponentName, DEFAULT_MAX_LEVEL);

	checkedNodes.forEach((checkedNode) => {
		resultCache.set(checkedNode, isWithin);
	});

	return { isWithin };
}
