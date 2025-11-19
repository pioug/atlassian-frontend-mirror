import coinflip from '../../../../coinflip';

import checkFiberWithinComponent from './check-fiber-within-component';
import findFiberWithCache from './find-fiber-with-cache';

const DEFAULT_MAX_LEVEL = 20;

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

	// Always use cached fiber strategy to handle non-React elements reliably
	fiber = findFiberWithCache(node, DEFAULT_MAX_LEVEL, checkedNodes);

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
