import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

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
 * Resets keyboard selection when the ordered items or reset key changes.
 * The caller chooses the key, for example a search term or the current category.
 */
export const useRegisteredMenuSelection = ({
	identities,
	resetKey,
}: Options): RegisteredMenuSelectionState => {
	const [selectedIndex, setSelectedIndex] = useState(() => (identities.length > 0 ? 0 : -1));
	const selectedIndexRef = useRef(selectedIndex);
	const identitySignature = useMemo(() => JSON.stringify(identities), [identities]);
	const itemCount = identities.length;

	const select = useCallback((index: number) => {
		selectedIndexRef.current = index;
		setSelectedIndex(index);
	}, []);

	useLayoutEffect(() => {
		select(itemCount > 0 ? 0 : -1);
	}, [identitySignature, itemCount, resetKey, select]);

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
