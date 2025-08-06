import { fg } from '@atlaskit/platform-feature-flags';

import coinflip from '../../../../coinflip';

import checkFiberWithinComponent from './check-fiber-within-component';
import findFiberWithCache from './find-fiber-with-cache';
import findReactFiber from './find-react-fiber';

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

export function cleanupCaches(resultCache: WeakMap<HTMLElement, boolean>) {
	resultCache = new WeakMap<HTMLElement, boolean>();
	callCount = 0;
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

	if (fg('platform_ufo_handle_non_react_element_for_3p')) {
		fiber = findFiberWithCache(node, DEFAULT_MAX_LEVEL, checkedNodes);
	} else {
		fiber = findReactFiber(node);
	}

	if (!fiber) {
		if (fg('platform_ufo_handle_non_react_element_for_3p')) {
			checkedNodes.forEach((checkedNode) => {
				resultCache.set(checkedNode, false);
			});
		}
		return { isWithin: false };
	}
	const isWithin = checkFiberWithinComponent(fiber, targetComponentName, DEFAULT_MAX_LEVEL);

	if (fg('platform_ufo_handle_non_react_element_for_3p')) {
		checkedNodes.forEach((checkedNode) => {
			resultCache.set(checkedNode, isWithin);
		});
	}

	return { isWithin };
}
