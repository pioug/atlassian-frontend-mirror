import findReactFiber from './find-react-fiber';

type FindFiberResult = {
	fiber: any | null;
	cachedResult?: boolean;
};

export default function findFiberWithCache(
	element: HTMLElement,
	maxLevel: number,
	checkedNodes: HTMLElement[],
	resultCache?: WeakMap<HTMLElement, boolean>,
): FindFiberResult {
	let currentElement: HTMLElement | null = element;
	let remainingLevels = maxLevel;

	while (currentElement && remainingLevels > 0) {
		const cachedResult = resultCache?.get(currentElement);
		if (cachedResult !== undefined) {
			return { fiber: null, cachedResult };
		}

		checkedNodes.push(currentElement);

		const fiber = findReactFiber(currentElement);
		if (fiber) {
			return { fiber };
		}

		currentElement = currentElement.parentElement as HTMLElement | null;
		remainingLevels--;
	}

	return { fiber: null };
}
