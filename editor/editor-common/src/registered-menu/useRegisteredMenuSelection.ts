import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { reconcileRegisteredMenuSelection } from './reconcileRegisteredMenuSelection';

type Options = {
	identities: readonly string[];
	resetKey?: string | number | symbol;
};

type RegisteredMenuSelectionState = {
	select: (index: number) => void;
	selectedIndex: number;
	selectNext: () => number;
	selectPrevious: () => number;
};

/**
 * Keeps selection on the same item as items reorder. If that item disappears,
 * keeps the previous index within the remaining items. A changed reset key
 * selects the first item instead.
 */
export const useRegisteredMenuSelection = ({
	identities,
	resetKey,
}: Options): RegisteredMenuSelectionState => {
	const [selectedIndex, setSelectedIndex] = useState(() => (identities.length > 0 ? 0 : -1));
	const selectedIndexRef = useRef(selectedIndex);
	const previousRef = useRef({ identities, resetKey });
	const itemCount = identities.length;

	const select = useCallback((index: number) => {
		selectedIndexRef.current = index;
		setSelectedIndex(index);
	}, []);

	useLayoutEffect(() => {
		const previous = previousRef.current;
		previousRef.current = { identities, resetKey };
		select(
			reconcileRegisteredMenuSelection({
				nextIdentities: identities,
				previousIdentities: previous.identities,
				previousIndex: selectedIndexRef.current,
				reset: previous.resetKey !== resetKey,
			}),
		);
	}, [identities, resetKey, select]);

	const selectNext = useCallback(() => {
		const currentIndex = selectedIndexRef.current;
		const nextIndex = itemCount === 0 ? -1 : currentIndex < 0 ? 0 : (currentIndex + 1) % itemCount;
		select(nextIndex);
		return nextIndex;
	}, [itemCount, select]);

	const selectPrevious = useCallback(() => {
		const currentIndex = selectedIndexRef.current;
		const previousIndex =
			itemCount === 0 ? -1 : currentIndex <= 0 ? itemCount - 1 : currentIndex - 1;
		select(previousIndex);
		return previousIndex;
	}, [itemCount, select]);

	return { selectedIndex, select, selectNext, selectPrevious };
};
