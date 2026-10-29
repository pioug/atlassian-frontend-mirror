import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { reconcileRegisteredMenuSelection } from './reconcileRegisteredMenuSelection';
import type { RegisteredMenuSelectionSource } from './types';

type Options = {
	identities: readonly string[];
	resetKey?: string | number | symbol;
};

type RegisteredMenuSelectionState = {
	select: (index: number, source: RegisteredMenuSelectionSource) => void;
	selectedIndex: number;
	selectionSource: RegisteredMenuSelectionSource;
	selectNext: () => number;
	selectPrevious: () => number;
};

/**
 * Keeps selection on the same item as items reorder. If that item disappears,
 * keeps the previous index within the remaining items. A changed reset key
 * selects the first item instead.
 * Tracks whether the keyboard or the pointer made the current selection, so callers
 * can scroll only keyboard selections into view. Reconciling a reorder keeps the
 * current source; a reset counts as a keyboard selection.
 */
export const useRegisteredMenuSelection = ({
	identities,
	resetKey,
}: Options): RegisteredMenuSelectionState => {
	const [selectedIndex, setSelectedIndex] = useState(() => (identities.length > 0 ? 0 : -1));
	const [selectionSource, setSelectionSource] = useState<RegisteredMenuSelectionSource>('keyboard');
	const selectedIndexRef = useRef(selectedIndex);
	const previousRef = useRef({ identities, resetKey });
	const itemCount = identities.length;

	const select = useCallback((index: number, source: RegisteredMenuSelectionSource) => {
		selectedIndexRef.current = index;
		setSelectedIndex(index);
		setSelectionSource(source);
	}, []);

	useLayoutEffect(() => {
		const previous = previousRef.current;
		previousRef.current = { identities, resetKey };
		const reset = previous.resetKey !== resetKey;
		const index = reconcileRegisteredMenuSelection({
			nextIdentities: identities,
			previousIdentities: previous.identities,
			previousIndex: selectedIndexRef.current,
			reset,
		});
		if (reset) {
			select(index, 'keyboard');
			return;
		}
		// The same item stays selected, so keep its source: a reorder under the pointer must not scroll.
		selectedIndexRef.current = index;
		setSelectedIndex(index);
	}, [identities, resetKey, select]);

	const selectNext = useCallback(() => {
		const currentIndex = selectedIndexRef.current;
		const nextIndex = itemCount === 0 ? -1 : currentIndex < 0 ? 0 : (currentIndex + 1) % itemCount;
		select(nextIndex, 'keyboard');
		return nextIndex;
	}, [itemCount, select]);

	const selectPrevious = useCallback(() => {
		const currentIndex = selectedIndexRef.current;
		const previousIndex =
			itemCount === 0 ? -1 : currentIndex <= 0 ? itemCount - 1 : currentIndex - 1;
		select(previousIndex, 'keyboard');
		return previousIndex;
	}, [itemCount, select]);

	return { selectedIndex, selectionSource, select, selectNext, selectPrevious };
};
