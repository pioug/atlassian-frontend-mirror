/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { VirtualItem as VirtualItemContext } from '@tanstack/react-virtual';
import React, { useCallback, useImperativeHandle } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEmojiPickerListContext } from '../../../hooks/useEmojiPickerListContext';
import {
	EMOJIPICKERLIST_KEYBOARD_KEYS_SUPPORTED,
	EMOJI_LIST_COLUMNS,
	EMOJI_LIST_PAGE_COUNT,
	KeyboardNavigationDirection,
	KeyboardKeys,
} from '../../../util/constants';

const virtualList = css({
	overflowX: 'hidden',
	overflowY: 'auto',
	'&:focus': {
		outline: 'none',
	},
	paddingBottom: token('space.100', '8px'),
});

const virtualRowStyle = css({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
});

type Props = {
	overscanRowCount: number;
	rowHeight: (index: number) => number;
	rowRenderer: (context: VirtualItemContext) => JSX.Element;
	onRowsRendered: (indexes: { startIndex: number }) => void;
	rowCount: number;
	scrollToAlignment: 'start' | 'end';
	width: number;
	height: number;
};

export type ListRef = {
	/**
	 * Scroll to the row by row index
	 * @param index row index of virtual list
	 */
	scrollToRow: (index?: number) => void;
	/**
	 * Scroll to the row by row index, and focus on last emoji in that row
	 * @param index row index of virtual list
	 * @returns
	 */
	scrollToRowAndFocusLastEmoji: (index?: number) => void;
	/**
	 * Scroll to a emoji in virtual list and focus on it
	 * @param rIndex row index of virtual list
	 * @param cIndex column index of virtual list
	 */
	scrollToEmojiAndFocus: (rIndex: number, cIndex: number) => void;
	/**
	 * Update the focus index of virtual list, which will manage tabIndex via EmojiPickerListContext
	 * @param rIndex row index of virtual list
	 * @param cIndex column index of virtual list
	 */
	updateFocusIndex: (rIndex: number, cIndex?: number) => void;
};

type EmojiFocusInfo = {
	rowIndex: number;
	columnIndex: number;
	element: HTMLButtonElement | null | undefined;
};

export const virtualListScrollContainerTestId = 'virtual-list-scroll-container';

export const VirtualList = React.forwardRef<ListRef, Props>((props, ref) => {
	const parentRef = React.useRef<HTMLDivElement>(null);
	const virtualistItemsRef = React.useRef<HTMLDivElement>(null);
	const { rowRenderer, onRowsRendered, scrollToAlignment, width, height, rowCount } = props;

	const { currentEmojisFocus, setEmojisFocus } = useEmojiPickerListContext();

	const getVirtualizerOptions = () => {
		const { rowCount, rowHeight, overscanRowCount } = props;
		return {
			count: rowCount,
			getScrollElement: () => parentRef.current,
			estimateSize: rowHeight,
			overscan: overscanRowCount,
			onChange: () => {
				const startIndex = getFirstVisibleListElementIndex();
				onRowsRendered({ startIndex });
			},
			scrollPaddingStart: 28,
			scrollPaddingEnd: 28,
		};
	};

	const rowVirtualizer = useVirtualizer(getVirtualizerOptions());

	const isElementVisible = (element: Element) => {
		const parent = parentRef.current as Element;
		const elementRect = element.getBoundingClientRect();
		const parentRect = parent.getBoundingClientRect();
		const elemTop = elementRect.top;
		const elemBottom = elementRect.bottom;
		const parentTop = parentRect.top;
		const parentBottom = parentRect.bottom;

		// Only completely visible elements return true:
		const isVisible = elemTop >= parentTop && elemBottom <= parentBottom;
		return isVisible;
	};

	const getFirstVisibleListElementIndex = useCallback(() => {
		const virtualList = rowVirtualizer.getVirtualItems();
		const renderedElements = parentRef.current?.firstChild?.childNodes;
		if (virtualList.length === 0 || !renderedElements || renderedElements.length === 0) {
			return 0;
		}
		// Convert NodeListOf<ChildNodes> to ChildNodes[]
		const renderedElementsToArray = Array.from(renderedElements);
		const firstVisibleIndex = renderedElementsToArray.findIndex((elem) =>
			isElementVisible(elem as Element),
		);
		if (firstVisibleIndex !== -1) {
			return virtualList[firstVisibleIndex]?.index || 0;
		}
		return 0;
	}, [rowVirtualizer]);

	/**
	 * Recurisive function to find next available emoji and it's focus indexes in the grid
	 *
	 * current focus element is at rowIndex.columnIndex
	 * if found element then return the element and focus indexes
	 * otherwise change row/column till find the element
	 * if can't find the element till reach the edge of grid, we keep current focus states
	 *
	 * @param rowIndex search from row index (0 based)
	 * @param columnIndex search from column index (0 based)
	 * @param direction search direction
	 */
	const findNextEmoji: (
		rowIndex: number,
		columnIndex: number,
		direction: `${KeyboardNavigationDirection}`,
	) => EmojiFocusInfo | null = useCallback(
		(rowIndex: number, columnIndex: number, direction: `${KeyboardNavigationDirection}`) => {
			const emojiToFocus: HTMLButtonElement | undefined | null =
				virtualistItemsRef.current?.querySelector(
					`[data-focus-index="${rowIndex}-${columnIndex}"]`,
				);
			const lastRowIndex = rowCount - 1;
			const lastColumnIndex = EMOJI_LIST_COLUMNS - 1;
			if (emojiToFocus) {
				return {
					element: emojiToFocus,
					rowIndex,
					columnIndex,
				};
			}
			switch (direction) {
				case KeyboardNavigationDirection.Down:
					if (rowIndex >= lastRowIndex) {
						return null;
					}
					// find emoji in same column but lower row
					return findNextEmoji(rowIndex + 1, columnIndex, KeyboardNavigationDirection.Down);
				case KeyboardNavigationDirection.Up:
					if (rowIndex <= 0) {
						return null;
					}
					// find emoji in same column but upper row
					return findNextEmoji(rowIndex - 1, columnIndex, KeyboardNavigationDirection.Up);
				case KeyboardNavigationDirection.Left:
					if (rowIndex <= 0) {
						return null;
					}
					if (columnIndex < 0) {
						// find emoji in upper row
						return findNextEmoji(rowIndex - 1, lastColumnIndex, KeyboardNavigationDirection.Left);
					}
					// find emoji on left in the current row
					return findNextEmoji(rowIndex, columnIndex - 1, KeyboardNavigationDirection.Left);
				case KeyboardNavigationDirection.Right:
					if (rowIndex >= lastRowIndex) {
						return null;
					}
					// if no emoji on right, we try first emoji in next row
					return findNextEmoji(rowIndex + 1, 0, KeyboardNavigationDirection.Right);
				default:
					return null;
			}
		},
		[rowCount],
	);

	/**
	 * Find the valid emoji to scroll and focus
	 */
	const scrollToRowAndFocusEmoji = useCallback(
		(emojiToFocus: EmojiFocusInfo | null) => {
			if (emojiToFocus) {
				rowVirtualizer.scrollToIndex(emojiToFocus.rowIndex);
				emojiToFocus.element?.focus({ preventScroll: true });
				setEmojisFocus({
					rowIndex: emojiToFocus.rowIndex,
					columnIndex: emojiToFocus.columnIndex,
				});
			}
		},
		[rowVirtualizer, setEmojisFocus],
	);

	const focusEmoji = useCallback(
		(
			rIndex: number,
			cIndex: number,
			direction: `${KeyboardNavigationDirection}`,
			waitForScrollFinish = false,
		) => {
			if (waitForScrollFinish) {
				// scroll to target rowIndex first to ensure the row is rendered in list.
				// used in page up/down, ctrl+Home, ctrl+End
				rowVirtualizer.scrollToIndex(rIndex);

				setTimeout(() => {
					const emojiToFocus = findNextEmoji(rIndex, cIndex, direction);
					scrollToRowAndFocusEmoji(emojiToFocus);
				}, 100); // 100ms is virtual list scrolling time
			} else {
				const emojiToFocus = findNextEmoji(rIndex, cIndex, direction);
				scrollToRowAndFocusEmoji(emojiToFocus);
			}
		},
		[scrollToRowAndFocusEmoji, findNextEmoji, rowVirtualizer],
	);

	// following the guide from https://www.w3.org/WAI/ARIA/apg/patterns/grid/
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!EMOJIPICKERLIST_KEYBOARD_KEYS_SUPPORTED.includes(e.key)) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();

		const lastRowIndex = rowCount - 1;
		const lastColumnIndex = EMOJI_LIST_COLUMNS - 1;

		// focus first emoji on first row
		if (e.key === KeyboardKeys.Home && e.ctrlKey) {
			focusEmoji(1, 0, KeyboardNavigationDirection.Up, true);
			return;
		} else if (e.key === KeyboardKeys.End && e.ctrlKey) {
			// focus last available emoji on last row
			focusEmoji(lastRowIndex, lastColumnIndex, KeyboardNavigationDirection.Left, true);
			return;
		}

		switch (e.key) {
			// navigate to the right column
			case KeyboardKeys.ArrowRight:
				focusEmoji(
					currentEmojisFocus.rowIndex,
					currentEmojisFocus.columnIndex + 1,
					KeyboardNavigationDirection.Right,
				);
				break;
			// navigate to the left column
			case KeyboardKeys.ArrowLeft:
				focusEmoji(
					currentEmojisFocus.rowIndex,
					currentEmojisFocus.columnIndex - 1,
					KeyboardNavigationDirection.Left,
				);
				break;
			// navigate to the down row
			case KeyboardKeys.ArrowDown:
				focusEmoji(
					currentEmojisFocus.rowIndex === lastRowIndex
						? lastRowIndex
						: currentEmojisFocus.rowIndex + 1,
					currentEmojisFocus.columnIndex,
					KeyboardNavigationDirection.Down,
				);
				break;
			// navigate to the row after {EMOJI_LIST_PAGE_COUNT} rows
			case KeyboardKeys.PageDown:
				focusEmoji(
					currentEmojisFocus.rowIndex + EMOJI_LIST_PAGE_COUNT,
					currentEmojisFocus.columnIndex,
					KeyboardNavigationDirection.Down,
					true,
				);
				break;
			// navigate to the up row
			case KeyboardKeys.ArrowUp:
				focusEmoji(
					currentEmojisFocus.rowIndex <= 1 ? 1 : currentEmojisFocus.rowIndex - 1,
					currentEmojisFocus.columnIndex,
					KeyboardNavigationDirection.Up,
				);
				break;
			// navigate to the row before {EMOJI_LIST_PAGE_COUNT} rows
			case KeyboardKeys.PageUp:
				focusEmoji(
					currentEmojisFocus.rowIndex - EMOJI_LIST_PAGE_COUNT,
					currentEmojisFocus.columnIndex,
					KeyboardNavigationDirection.Up,
					true,
				);
				break;
			// navigate to the first cell of current row
			case KeyboardKeys.Home:
				focusEmoji(currentEmojisFocus.rowIndex, 0, KeyboardNavigationDirection.Left);
				break;
			// navigate to the last cell of current row
			case KeyboardKeys.End:
				focusEmoji(currentEmojisFocus.rowIndex, lastColumnIndex, KeyboardNavigationDirection.Left);
				break;
		}
	};

	// Exposing a custom ref handle to the parent component EmojiPickerList to trigger scrollToRow via the listRef
	// https://beta.reactjs.org/reference/react/useImperativeHandle
	useImperativeHandle(ref, () => {
		return {
			scrollToRow(index?: number) {
				if (index !== undefined) {
					rowVirtualizer.setOptions({
						...rowVirtualizer.options,
						scrollPaddingStart: 0,
					});
					rowVirtualizer.scrollToIndex(index, {
						align: scrollToAlignment,
					});
				}
			},
			scrollToRowAndFocusLastEmoji(index?: number) {
				if (index !== undefined) {
					focusEmoji(index, EMOJI_LIST_COLUMNS, KeyboardNavigationDirection.Left, true);
				}
			},
			scrollToEmojiAndFocus(rowIndex: number, columnIndex: number) {
				focusEmoji(rowIndex, columnIndex, KeyboardNavigationDirection.Left, true);
			},
			updateFocusIndex(rowIndex: number, columnIndex = 0) {
				// row could be removed from virtual list after scrolling, we'll update emoji cell tabIndex after losing focus
				if (!virtualistItemsRef.current?.contains(document.activeElement)) {
					setEmojisFocus({ rowIndex, columnIndex });
				}
			},
		};
	}, [setEmojisFocus, focusEmoji, rowVirtualizer, scrollToAlignment]);

	return (
		<div
			ref={parentRef}
			style={{
				height: `${height}px`,
				width: `${width}px`,
			}}
			css={virtualList}
			data-testid={virtualListScrollContainerTestId}
			aria-labelledby="emoji-picker-table-description"
			role="grid"
		>
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: '100%',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'relative',
				}}
				ref={virtualistItemsRef}
				onKeyDown={handleKeyDown}
				role="presentation"
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow, index) => (
					<div
						key={virtualRow.key}
						css={virtualRowStyle}
						style={{
							height: `${virtualRow.size}px`,
							transform: `translateY(${virtualRow.start}px)`,
						}}
						role="row"
						aria-rowindex={index + 1}
					>
						{rowRenderer(virtualRow)}
					</div>
				))}
			</div>
		</div>
	);
});
