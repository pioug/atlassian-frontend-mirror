/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';

import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import { N0, N30A, N60A } from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { withReactEditorViewOuterListeners as withOuterListeners } from '../../ui-react';
import Popup from '../Popup';

import tableSelectorPopup, {
	TABLE_SELECTOR_BUTTON_GAP,
	TABLE_SELECTOR_BUTTON_SIZE,
} from './table-selector';

const TABLE_SELECTOR_PADDING_TOP = 8;
const TABLE_SELECTOR_PADDING_SIDE = 10;

const DEFAULT_TABLE_SELECTOR_ROWS = 5;
const DEFAULT_TABLE_SELECTOR_COLS = 10;
const DEFAULT_TABLE_SELECTOR_SELECTION_SIZE = 1;
const DEFAULT_MAX_TABLE_SELECTOR_ROWS = 10;

export interface OnTableSizeSelection {
	(rowsCount: number, colsCount: number, event?: SyntheticEvent): void;
}
const TableSelectorWithListeners = withOuterListeners(tableSelectorPopup);

const initialSizeState = {
	col: DEFAULT_TABLE_SELECTOR_SELECTION_SIZE,
	row: DEFAULT_TABLE_SELECTOR_SELECTION_SIZE,
	maxCol: DEFAULT_TABLE_SELECTOR_COLS,
	maxRow: DEFAULT_TABLE_SELECTOR_ROWS,
};

type SimpleEventHandler<T> = (event: T) => void;

const tableSelectorPopupWrapperStyles = css({
	borderRadius: token('border.radius', '3px'),
	backgroundColor: token('elevation.surface.overlay', N0),
	boxShadow: token(
		'elevation.shadow.overlay',
		`0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A}`,
	),
	padding: `${token(
		'space.100',
		`${TABLE_SELECTOR_PADDING_TOP}px`,
	)} ${TABLE_SELECTOR_PADDING_SIDE}px`,
});

export interface TableSelectorPopupProps {
	onUnmount?: () => void;
	onSelection: OnTableSizeSelection;
	target?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	handleClickOutside?: SimpleEventHandler<MouseEvent>;
	handleEscapeKeydown?: SimpleEventHandler<KeyboardEvent>;
	isOpenedByKeyboard: boolean;
	defaultSize?: {
		row: number;
		col: number;
	};
	allowOutsideSelection?: boolean;
}

export const TableSelectorPopup = (props: TableSelectorPopupProps) => {
	const [size, setSize] = useState({ ...initialSizeState, ...props.defaultSize });

	const tablePopupRef = useRef(null);
	// If popup opened by keyboard enable keyboard mode
	const isKeyboardMode = useRef(props.isOpenedByKeyboard);

	const enableKeyboardMode = useCallback(() => {
		if (!isKeyboardMode.current) {
			isKeyboardMode.current = true;
		}
	}, [isKeyboardMode]);
	const disableKeyboardMode = useCallback(() => {
		if (isKeyboardMode.current) {
			isKeyboardMode.current = false;
		}
	}, [isKeyboardMode]);

	// Mouse move is used to allow selection changes outside of the popup and is more reactive to changes.
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!tablePopupRef.current) {
				return;
			}

			disableKeyboardMode();

			const tablePopup: HTMLElement = tablePopupRef.current;
			const { left, top } = tablePopup.getBoundingClientRect();

			// Mouse position on popup
			const selectedWidth = e.clientX - left;
			const selectedHeight = e.clientY - top;

			// Calculate number grid cells selected
			let selectedGridCols = Math.ceil(
				(selectedWidth - TABLE_SELECTOR_PADDING_SIDE + TABLE_SELECTOR_BUTTON_GAP) /
					(TABLE_SELECTOR_BUTTON_GAP + TABLE_SELECTOR_BUTTON_SIZE),
			);
			let selectedGridRows = Math.ceil(
				(selectedHeight - TABLE_SELECTOR_PADDING_TOP + TABLE_SELECTOR_BUTTON_GAP) /
					(TABLE_SELECTOR_BUTTON_GAP + TABLE_SELECTOR_BUTTON_SIZE),
			);
			// Keep the selected rows and columns within the defined bounds
			let gridRows = DEFAULT_TABLE_SELECTOR_ROWS;

			if (selectedGridCols < 1) {
				selectedGridCols = 1;
			}
			if (selectedGridCols > size.maxCol) {
				selectedGridCols = size.maxCol;
			}
			if (selectedGridRows < 1) {
				selectedGridRows = 1;
			}

			// Expand grid when row selection is greater than the default grid size
			if (
				selectedGridRows >= DEFAULT_TABLE_SELECTOR_ROWS &&
				selectedGridRows < DEFAULT_MAX_TABLE_SELECTOR_ROWS
			) {
				gridRows = selectedGridRows + 1;
			}
			if (selectedGridRows >= DEFAULT_MAX_TABLE_SELECTOR_ROWS) {
				selectedGridRows = DEFAULT_MAX_TABLE_SELECTOR_ROWS;
				gridRows = DEFAULT_MAX_TABLE_SELECTOR_ROWS;
			}

			if (selectedGridCols !== size.col || selectedGridRows !== size.row) {
				setSize({
					col: selectedGridCols,
					row: selectedGridRows,
					maxCol: DEFAULT_TABLE_SELECTOR_COLS,
					maxRow: gridRows,
				});
			}
		},
		[disableKeyboardMode, size, setSize],
	);

	const decreasingSequence = (maxNumber: number, prevNumber: number): number => {
		let nextNumber = prevNumber - 1;
		if (prevNumber === 1) {
			nextNumber = maxNumber;
		}
		return nextNumber;
	};

	const getMaxRow = (
		prevSize: { col: number; row: number; maxCol: number; maxRow: number },
		eventKey: string,
	): number => {
		switch (eventKey) {
			case 'ArrowDown':
				// Expand the grid size when last row selected
				if (
					prevSize.maxRow < DEFAULT_MAX_TABLE_SELECTOR_ROWS &&
					prevSize.row >= DEFAULT_TABLE_SELECTOR_ROWS - 1
				) {
					return prevSize.maxRow + 1;
				}
				if (prevSize.row === DEFAULT_MAX_TABLE_SELECTOR_ROWS) {
					return DEFAULT_TABLE_SELECTOR_ROWS;
				}
				return prevSize.maxRow;
			case 'ArrowLeft':
				const moveToPrevRow: boolean = prevSize.col === 1 && prevSize.row > 1;
				const moveToLastRow: boolean = prevSize.row === 1 && prevSize.col === 1;
				// Expand the popup to max size when selected row wraps around to last row
				if (moveToLastRow) {
					return DEFAULT_MAX_TABLE_SELECTOR_ROWS;
				}
				// Decrease the popup when decreased row selection
				if (prevSize.maxRow > DEFAULT_TABLE_SELECTOR_ROWS && moveToPrevRow) {
					return prevSize.row;
				}
				return prevSize.maxRow;
			case 'ArrowUp':
				if (prevSize.row === 1) {
					return DEFAULT_MAX_TABLE_SELECTOR_ROWS;
					// Decrease the popup size when decreased row selection
				} else if (prevSize.maxRow > DEFAULT_TABLE_SELECTOR_ROWS) {
					return prevSize.row;
				}
				return prevSize.maxRow;
			case 'ArrowRight':
				const moveToNextRow: boolean = prevSize.col === DEFAULT_TABLE_SELECTOR_COLS;
				const increaseMaxRow: boolean =
					prevSize.maxRow < DEFAULT_MAX_TABLE_SELECTOR_ROWS &&
					moveToNextRow &&
					prevSize.row + 1 === prevSize.maxRow;

				// Decrease popup size for wrap around to selection 1 x 1
				if (
					prevSize.row === DEFAULT_MAX_TABLE_SELECTOR_ROWS &&
					prevSize.col === DEFAULT_TABLE_SELECTOR_COLS
				) {
					return DEFAULT_TABLE_SELECTOR_ROWS;
					// Decrease the popup size when decreased row selection
				} else if (increaseMaxRow) {
					return prevSize.maxRow + 1;
				}
				return prevSize.maxRow;
			default:
				return prevSize.maxRow;
		}
	};

	const handleInitialButtonFocus = useCallback(() => {
		if (isKeyboardMode.current !== true) {
			enableKeyboardMode();
			setSize(initialSizeState);
		}
	}, [enableKeyboardMode, setSize]);

	const handleKeyDown = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(event: React.KeyboardEvent<HTMLButtonElement>) => {
			if (event.key === 'ArrowDown') {
				enableKeyboardMode();

				setSize((prevSize) => {
					return {
						...prevSize,
						row: (prevSize.row % prevSize.maxRow) + 1,
						maxRow: getMaxRow(prevSize, event.key),
					};
				});

				if (editorExperiment('platform_editor_controls', 'variant1')) {
					event.preventDefault();
				}
			}
			if (event.key === 'ArrowRight') {
				enableKeyboardMode();

				setSize((prevSize) => {
					const moveToNextRow: boolean = prevSize.col === DEFAULT_TABLE_SELECTOR_COLS;

					return {
						...prevSize,
						col: (prevSize.col % DEFAULT_TABLE_SELECTOR_COLS) + 1,
						row: moveToNextRow ? (prevSize.row % prevSize.maxRow) + 1 : prevSize.row,
						maxRow: getMaxRow(prevSize, event.key),
					};
				});
			}
			if (event.key === 'ArrowLeft') {
				enableKeyboardMode();

				setSize((prevSize) => {
					const getRow = (prevRow: number, prevCol: number): number => {
						const row = prevRow;
						// Move to previous row for wrap around
						if (prevSize.col === 1 && prevSize.row > 1) {
							return prevRow - 1;
							// Increase the selection to max size when selected row and column wraps around
						} else if (prevRow === 1 && prevCol === 1) {
							return DEFAULT_MAX_TABLE_SELECTOR_ROWS;
						}
						return row;
					};

					return {
						...prevSize,
						col: decreasingSequence(prevSize.maxCol, prevSize.col),
						row: getRow(prevSize.row, prevSize.col),
						maxRow: getMaxRow(prevSize, event.key),
					};
				});
			}
			if (event.key === 'ArrowUp') {
				enableKeyboardMode();

				setSize((prevSize) => {
					const moveToLastRow: boolean = prevSize.row === 1;
					return {
						...prevSize,
						row: moveToLastRow
							? DEFAULT_MAX_TABLE_SELECTOR_ROWS
							: decreasingSequence(prevSize.maxRow, prevSize.row),
						maxRow: getMaxRow(prevSize, event.key),
					};
				});

				if (editorExperiment('platform_editor_controls', 'variant1')) {
					event.preventDefault();
				}
			}
		},
		[enableKeyboardMode, setSize],
	);

	useEffect(() => {
		let unbind;
		const target = props.allowOutsideSelection ? window : tablePopupRef.current;
		if (target) {
			unbind = bind(target, {
				type: 'mousemove',
				listener: handleMouseMove,
			});
		}

		return unbind;
	}, [handleMouseMove, props.allowOutsideSelection, tablePopupRef]);

	return (
		<Popup
			target={props.target}
			offset={[0, 3]}
			mountTo={props.popupsMountPoint}
			boundariesElement={props.popupsBoundariesElement}
			scrollableElement={props.popupsScrollableElement}
			focusTrap
			onUnmount={props.onUnmount}
			zIndex={akEditorMenuZIndex}
		>
			<div css={tableSelectorPopupWrapperStyles} ref={tablePopupRef}>
				<TableSelectorWithListeners
					handleClickOutside={props.handleClickOutside}
					handleEscapeKeydown={props.handleEscapeKeydown}
					maxCols={size.maxCol}
					maxRows={size.maxRow}
					onSelection={props.onSelection}
					selectedCol={size.col}
					selectedRow={size.row}
					onKeyDown={handleKeyDown}
					isFocused={isKeyboardMode.current}
					handleInitialButtonFocus={handleInitialButtonFocus}
				/>
			</div>
		</Popup>
	);
};

export default TableSelectorPopup;
