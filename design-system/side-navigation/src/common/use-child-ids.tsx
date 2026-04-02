import { type MutableRefObject, useEffect, useRef } from 'react';

import { ROOT_ID } from '../components/NestableNavigationContent';

const useChildIds: (
	currentStackId: string,
	committedStack: string[],
	onUnknownNest?: (stack: string[]) => void,
) => {
	childIdsRef: MutableRefObject<Set<string>>;
} = (
	currentStackId: string,
	committedStack: string[],
	onUnknownNest?: (stack: string[]) => void,
) => {
	const childIdsRef = useRef(new Set<string>());

	useEffect(() => {
		// we are holding navigation item IDs in childIdsRef
		// check if the current displayed nav item (currentStackId) is in childIdsRef. if it's not, this means it's undefined
		if (
			currentStackId === ROOT_ID ||
			!childIdsRef.current.size ||
			childIdsRef.current.has(currentStackId) ||
			!onUnknownNest
		) {
			return;
		}

		onUnknownNest(committedStack || [currentStackId]);
	}, [currentStackId, committedStack, onUnknownNest]);

	return { childIdsRef };
};

export default useChildIds;
