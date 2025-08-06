import findReactFiber from './find-react-fiber';

export default function findFiberWithCache(
	element: HTMLElement,
	maxLevel: number,
	checkedNodes: HTMLElement[],
): any | null {
	// Stop when no more levels to traverse
	if (maxLevel <= 0) {
		return null;
	}
	checkedNodes.push(element);

	const fiber = findReactFiber(element);

	if (fiber) {
		return fiber;
	}

	// Walk up the DOM tree to find the fiber
	const parent = element.parentElement as HTMLElement;
	if (!parent) {
		return null;
	}

	// Recursively check parent
	return findFiberWithCache(parent, maxLevel - 1, checkedNodes);
}
