import type React from 'react';
import { useCallback, useEffect, useReducer, useRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
/**
 * a custom hook that handles keyboard navigation for Arrow keys based on a
 * given listSize, and a step (for up and down arrows).
 *
 * @param {number} listSize
 * @param {number} upDownStep
 *
 * Example usage:
 *    const list = ['Confluence','Jira','Atlaskit'];
 *    const {
 *      selectedItemIndex,
 *      focusedItemIndex,
 *      focusOnSearch,
 *      focusOnViewMore,
 *      setFocusedItemIndex,
 *      onKeyDown
 *    } = useSelectAndFocusOnArrowNavigation(list.length - 1, 1);
 *
 *    return (
 *      <div onKeyDown={onKeyDown}>
 *        <SearchBar onClick={() => setFocusedItemIndex(undefined)} focus={focusOnSearch} />
 *        {list.map((item, index) => (
 *           <ListItem
 *            title={item}
 *            style={{ ..., color: selected ? 'selectedStateColor' : defaultColor }}
 *            onClick={() => {
 *              setFocusedItemIndex(index);
 *            }
 *          />
 *        )}
 *      </div>
 *    );
 *
 *    const SearchBar = ({ focus }) => {
 *      const ref = useRefToFocusOrScroll(focus);
 *      return <input ref={ref} />
 *    }
 *
 */

type ReducerState = {
	canFocusViewMore?: boolean;
	focusedCategoryIndex?: number;
	focusedItemIndex?: number;
	focusOnEmptyStateButton?: boolean;
	focusOnSearch: boolean;
	focusOnViewMore: boolean;
	listSize: number;
	selectedItemIndex?: number;
};

export enum ACTIONS {
	FOCUS_SEARCH = 'focusOnSearch',
	UPDATE_STATE = 'updateState',
	MOVE = 'move',
}

export type ReducerAction = {
	payload: Partial<ReducerState> & {
		positions?: number;
		step?: number;
	};
	type: ACTIONS;
};

const reducer = (state: ReducerState, action: ReducerAction) => {
	switch (action.type) {
		case ACTIONS.UPDATE_STATE:
			return {
				...state,
				...action.payload,
			};

		case ACTIONS.FOCUS_SEARCH:
			return {
				...state,
				focusedItemIndex: undefined,
				focusedCategoryIndex: undefined,
				focusOnSearch: true,
				focusOnViewMore: false,
			};

		case ACTIONS.MOVE:
			return moveReducer(state, action);
	}
};

const moveReducer = (state: ReducerState, action: ReducerAction): ReducerState => {
	const { listSize, canFocusViewMore } = state;
	if (state.focusOnSearch) {
		// up arrow
		if (action.payload.positions && action.payload.positions <= -1) {
			return {
				...state,
				focusOnSearch: false,
				focusOnViewMore: !!canFocusViewMore,
				focusedItemIndex: canFocusViewMore ? undefined : listSize,
				selectedItemIndex: canFocusViewMore ? undefined : listSize,
			};
		} else {
			const newIndex = action.payload.positions
				? action.payload.positions - (action.payload.step ?? 1)
				: 0;
			const safeIndex = ensureSafeIndex(newIndex, state.listSize);
			const isLastItemFocused = newIndex > listSize;
			const focusOnSearch = isLastItemFocused && !canFocusViewMore;
			const focusOnViewMore = isLastItemFocused && !!canFocusViewMore;
			return {
				...state,
				focusOnSearch: focusOnSearch,
				focusOnViewMore: focusOnViewMore,
				focusedItemIndex: safeIndex,
				selectedItemIndex: safeIndex,
			};
		}
	}

	if (state.focusOnViewMore) {
		// down arrow
		if (action.payload.positions === 1) {
			return {
				...state,
				focusOnSearch: true,
				focusOnViewMore: false,
				focusedItemIndex: undefined,
				// if search is focused then select first item.
				selectedItemIndex: 0,
			};
		} else {
			return {
				...state,
				focusOnSearch: false,
				focusOnViewMore: false,
				focusedItemIndex: listSize,
				selectedItemIndex: listSize,
			};
		}
	}

	const newIndex = state.selectedItemIndex
		? // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			state.selectedItemIndex + action.payload.positions!
		: // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			action.payload.positions!;

	const safeIndex = ensureSafeIndex(newIndex, state.listSize);
	// down arrow key is pressed or right arrow key is pressed.
	if (
		state.focusedItemIndex !== undefined &&
		action.payload.positions &&
		action.payload.positions >= 1
	) {
		// when multi column element browser is open and we are in last
		//  row then newIndex will be greater than listSize when
		//  down arrow key is pressed.
		// Or when last item is focused and down or right arrow key is pressed.
		const isLastItemFocused = newIndex > listSize;
		const focusOnSearch = isLastItemFocused && !canFocusViewMore;
		const focusOnViewMore = isLastItemFocused && !!canFocusViewMore;
		// if search is focused, then select first item.
		// otherwise if view more is focused then select item should be undefined.
		const selectedItemIndex = focusOnSearch ? 0 : focusOnViewMore ? undefined : safeIndex;
		return {
			...state,
			focusOnSearch,
			focusOnViewMore,
			selectedItemIndex,
			focusedItemIndex: isLastItemFocused ? undefined : safeIndex,
		};
	}

	// up arrow key is pressed or left arrow key is pressed.
	if (
		state.focusedItemIndex !== undefined &&
		action.payload.positions &&
		action.payload.positions <= -1
	) {
		// if arrow up key is pressed when focus is in first row,
		//  or, arrow left key is pressed when first item is focused,
		//  then newIndex will become less than zero.
		// In this case, focus search, and, kept previously selected item.
		const isFirstRowFocused = newIndex < 0;
		// if focus goes to search then kept last selected item in first row.
		const selectedItemIndex = isFirstRowFocused ? state.selectedItemIndex : safeIndex;
		return {
			...state,
			// focus search if first item is focused on up or left arrow key
			focusOnSearch: isFirstRowFocused,
			focusOnViewMore: false,
			focusedItemIndex: isFirstRowFocused ? undefined : safeIndex,
			selectedItemIndex,
		};
	}

	if (fg('jfp_a11y_fix_create_issue_no_results_link_focus')) {
		// Handle empty state navigation
		if (state.listSize === -1) {
			// If currently on search, ArrowDown and ArrowUp moves to EmptyState button
			if (state.focusOnSearch && action.payload.positions && action.payload.positions > 0) {
				return {
					...state,
					focusOnSearch: false,
					focusOnEmptyStateButton: true,
				};
			}
			// If currently on EmptyState button, ArrowUp and ArrowDown moves back to search
			if (
				state.focusOnEmptyStateButton &&
				action.payload.positions &&
				action.payload.positions < 0
			) {
				return {
					...state,
					focusOnSearch: true,
					focusOnEmptyStateButton: false,
				};
			}
			// Stay on EmptyState button for other arrows
			return {
				...state,
				focusOnSearch: false,
				focusOnEmptyStateButton: true,
			};
		}
	}

	return {
		...state,
		focusOnSearch: false,
		focusOnViewMore: false,
		selectedItemIndex: safeIndex,
		focusedItemIndex: safeIndex,
	};
};

const initialState: ReducerState = {
	focusOnSearch: true,
	focusOnViewMore: false,
	focusOnEmptyStateButton: false,
	selectedItemIndex: 0,
	focusedItemIndex: undefined,
	listSize: 0,
};

const initialStateWithFocusOnSearchDisabled: ReducerState = {
	...initialState,
	focusOnSearch: false,
};

const getInitialState =
	(listSize: number, canFocusViewMore: boolean) => (initialState: ReducerState) => ({
		...initialState,
		listSize,
		canFocusViewMore,
	});

// Get the offset forwards - skip items that are disabled
const skipForwardOffsetToSafeItem = (
	currentIndex: number | undefined,
	listSize: number,
	stepSize: number,
	itemIsDisabled: (idx: number) => boolean,
): number | undefined => {
	if (currentIndex === undefined) {
		return undefined;
	}
	// Iterate through the list starting from the next item
	for (let offset = 1; currentIndex + offset * stepSize <= listSize; offset++) {
		if (!itemIsDisabled(currentIndex + offset * stepSize)) {
			return offset * stepSize;
		}
	}

	// Move to the last place if possible
	return listSize - currentIndex + 1;
};

// Get the offset backwards - skip items that are disabled
const skipBackwardOffsetToSafeItem = (
	currentIndex: number | undefined,
	stepSize: number,
	itemIsDisabled: (idx: number) => boolean,
): number | undefined => {
	if (currentIndex === undefined) {
		return undefined;
	}

	// Iterate backwards starting from the previous item
	for (let offset = 1; currentIndex - offset * stepSize >= -1; offset++) {
		if (
			!itemIsDisabled(currentIndex - offset * stepSize) ||
			currentIndex - offset * stepSize === -1
		) {
			return offset * stepSize;
		}
	}

	// Move to search if no available index
	return currentIndex + 1;
};

export type useSelectAndFocusReturnType = {
	focusedCategoryIndex?: number;
	focusedItemIndex?: number;
	focusOnEmptyStateButton?: boolean;
	focusOnSearch: boolean;
	focusOnViewMore: boolean;
	onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
	selectedItemIndex?: number;
	setFocusedCategoryIndex: (index?: number) => void;
	setFocusedItemIndex: (index?: number) => void;
	setFocusOnSearch: () => void;
};

function useSelectAndFocusOnArrowNavigation(
	listSize: number,
	step: number,
	canFocusViewMore: boolean,
	itemIsDisabled: (index: number) => boolean,
	isFocusSearch?: boolean,
	autoFocusSearch?: boolean,
): useSelectAndFocusReturnType {
	const [state, dispatch] = useReducer(
		reducer,
		autoFocusSearch ? initialState : initialStateWithFocusOnSearchDisabled,
		getInitialState(listSize, canFocusViewMore),
	);

	useEffect(() => {
		dispatch({
			type: ACTIONS.UPDATE_STATE,
			payload: { canFocusViewMore },
		});
	}, [canFocusViewMore]);

	const {
		selectedItemIndex,
		focusedItemIndex,
		focusOnSearch,
		focusOnViewMore,
		focusedCategoryIndex,
		focusOnEmptyStateButton,
	} = state;

	// calls if items size changed
	const reset = useCallback(
		(listSize: number) => {
			const defaultState = autoFocusSearch ? initialState : initialStateWithFocusOnSearchDisabled;

			let payload = {
				...defaultState,
				listSize,
			};
			// A11Y: if categories exist ,on the initial render search element should receive focus.
			// After user pick some category the category should stay focused.
			payload = Object.assign(payload, {
				focusOnSearch: isFocusSearch ?? defaultState.focusOnSearch,
			});

			dispatch({
				type: ACTIONS.UPDATE_STATE,
				payload,
			});
		},
		[isFocusSearch, autoFocusSearch],
	);

	const removeFocusFromSearchAndSetOnItem = useCallback(
		(index?: number) => {
			let payload: Partial<ReducerState> = {
				focusedItemIndex: index,
				selectedItemIndex: index,
				focusOnSearch: false,
				focusOnViewMore: false,
			};
			payload = Object.assign(payload, {
				focusedCategoryIndex: undefined,
			});

			dispatch({
				type: ACTIONS.UPDATE_STATE,
				payload,
			});
		},
		[dispatch],
	);

	const setFocusedCategoryIndex = useCallback(
		(index?: number) => {
			const payload: Partial<ReducerState> = {
				focusOnSearch: false,
				focusOnViewMore: false,
				focusedCategoryIndex: index,
				focusedItemIndex: undefined,
			};

			dispatch({
				type: ACTIONS.UPDATE_STATE,
				payload,
			});
		},
		[dispatch],
	);

	const setFocusOnSearch = useCallback(() => {
		dispatch({
			type: ACTIONS.FOCUS_SEARCH,
			payload: {},
		});
	}, [dispatch]);

	const isMoving = useRef(false);

	const move = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>, positions: number, actualStep?: number) => {
			e.preventDefault();
			e.stopPropagation();

			// avoid firing 2 moves at the same time when holding an arrow down as this can freeze the screen
			if (!isMoving.current) {
				isMoving.current = true;
				requestAnimationFrame(() => {
					isMoving.current = false;
					dispatch({
						type: ACTIONS.MOVE,
						payload: {
							positions,
							step: actualStep,
						},
					});
				});
			}
		},
		[],
	);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const avoidKeysWhileSearching = [
				'/', // While already focused on search bar, let users type in.
				'ArrowRight',
				'ArrowLeft',
			];
			if (focusOnSearch && avoidKeysWhileSearching.includes(e.key)) {
				return;
			}

			if (fg('jfp_a11y_fix_create_issue_no_results_link_focus')) {
				// Handle empty state navigation and trap focus between search and CTA
				if (listSize === -1) {
					if (e.key === 'Tab') {
						e.preventDefault();
						dispatch({
							type: ACTIONS.UPDATE_STATE,
							payload: {
								focusOnSearch: focusOnEmptyStateButton, // cycle focus between search and button
								focusOnEmptyStateButton: !focusOnEmptyStateButton, // toggle
							},
						});
						return;
					}
				}
			}

			switch (e.key) {
				case '/':
					e.preventDefault();
					e.stopPropagation();
					return setFocusOnSearch();

				case 'ArrowRight': {
					const itemIndex = focusOnSearch ? -1 : selectedItemIndex;
					const nextItem = skipForwardOffsetToSafeItem(itemIndex, listSize, 1, itemIsDisabled) ?? 1;
					return move(e, nextItem);
				}

				case 'ArrowLeft': {
					const nextItem = skipBackwardOffsetToSafeItem(selectedItemIndex, 1, itemIsDisabled) ?? 1;
					return move(e, -nextItem);
				}

				case 'ArrowDown': {
					const itemIndex = focusOnSearch ? -step : selectedItemIndex;
					const nextItem =
						skipForwardOffsetToSafeItem(itemIndex, listSize, step, itemIsDisabled) ?? step;
					return move(e, +nextItem, step);
				}

				case 'ArrowUp': {
					const nextItem =
						skipBackwardOffsetToSafeItem(selectedItemIndex, step, itemIsDisabled) ?? step;
					return move(e, Math.min(-nextItem, -step), step);
				}
			}
		},
		[
			focusOnSearch,
			setFocusOnSearch,
			move,
			selectedItemIndex,
			itemIsDisabled,
			listSize,
			step,
			focusOnEmptyStateButton,
		],
	);

	useEffect(() => {
		// To reset selection when user filters
		reset(listSize);
	}, [listSize, reset]);

	return {
		selectedItemIndex,
		onKeyDown,
		focusOnSearch,
		focusOnViewMore,
		focusOnEmptyStateButton,
		setFocusOnSearch,
		focusedItemIndex,
		setFocusedItemIndex: removeFocusFromSearchAndSetOnItem,
		focusedCategoryIndex,
		setFocusedCategoryIndex: setFocusedCategoryIndex,
	};
}

export const ensureSafeIndex = (index: number, listSize: number): number => {
	if (index < 0) {
		return 0;
	}

	if (index > listSize) {
		return listSize;
	}

	return index;
};

export default useSelectAndFocusOnArrowNavigation;
