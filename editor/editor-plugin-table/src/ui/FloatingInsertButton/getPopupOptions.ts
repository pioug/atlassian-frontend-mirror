import type { PopupProps } from '@atlaskit/editor-common/ui';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';

import type { TableDirection } from '../../types';
import {
	tableInsertColumnButtonOffset,
	tableInsertColumnButtonSize,
	tableToolbarSize,
} from '../consts';

const HORIZONTAL_ALIGN_COLUMN_BUTTON = -(tableInsertColumnButtonSize / 2);
const HORIZONTAL_ALIGN_NUMBERED_COLUMN_BUTTON =
	HORIZONTAL_ALIGN_COLUMN_BUTTON + akEditorTableNumberColumnWidth;

const VERTICAL_ALIGN_COLUMN_BUTTON = tableToolbarSize + tableInsertColumnButtonOffset;

const VERTICAL_ALIGN_COLUMN_BUTTON_DRAG = tableInsertColumnButtonOffset;

const HORIZONTAL_ALIGN_ROW_BUTTON = -(
	tableToolbarSize +
	tableInsertColumnButtonOffset +
	tableInsertColumnButtonSize
);

const HORIZONTAL_ALIGN_ROW_BUTTON_DRAG = -18;

const VERTICAL_ALIGN_ROW_BUTTON = tableInsertColumnButtonSize / 2;

function getRowOptions(index: number, isDragAndDropEnabled: boolean): Partial<PopupProps> {
	let defaultOptions = {
		alignX: 'left',
		alignY: 'bottom',
		offset: [0, VERTICAL_ALIGN_ROW_BUTTON],
	} as PopupProps;

	if (index === 0) {
		defaultOptions = {
			...defaultOptions,
			alignY: 'top',
			// The offset is the inverse the original, because is align top nop bottom.
			offset: [0, -VERTICAL_ALIGN_ROW_BUTTON],
		};
	}

	return {
		...defaultOptions,
		onPositionCalculated(position) {
			return {
				...position,
				// Left position should be always the offset (To place in the correct position even if the table has overflow).
				left: isDragAndDropEnabled ? HORIZONTAL_ALIGN_ROW_BUTTON_DRAG : HORIZONTAL_ALIGN_ROW_BUTTON,
			};
		},
	};
}

function getColumnOptions(
	index: number,
	tableContainer: HTMLElement | null,
	hasNumberedColumns: boolean,
	isDragAndDropEnabled: boolean,
): Partial<PopupProps> {
	const options: Partial<PopupProps> = {
		alignX: 'end',
		alignY: 'top',
		offset: [
			HORIZONTAL_ALIGN_COLUMN_BUTTON,
			isDragAndDropEnabled ? VERTICAL_ALIGN_COLUMN_BUTTON_DRAG : VERTICAL_ALIGN_COLUMN_BUTTON,
		],
		// :: (position: PopupPosition) -> PopupPosition
		// Limit the InsertButton position to the table container
		// if the left position starts before it
		// we should always set the InsertButton on the start,
		// considering the offset from the first column
		onPositionCalculated(position) {
			const { left } = position;
			if (!left) {
				// If not left, lest skip expensive next calculations.
				return position;
			}

			if (index === 0) {
				return {
					...position,
					left: hasNumberedColumns
						? HORIZONTAL_ALIGN_NUMBERED_COLUMN_BUTTON
						: HORIZONTAL_ALIGN_COLUMN_BUTTON,
				};
			}

			// Check if current position is greater than the available container width
			const rect = tableContainer ? tableContainer.getBoundingClientRect() : null;

			return {
				...position,
				left: rect && left > rect.width ? rect.width : left,
			};
		},
	};

	// We need to change the popup position when
	// the column index is zero
	if (index === 0) {
		return {
			...options,
			alignX: 'left',
			alignY: 'top',
		};
	}

	return options;
}

function getPopupOptions(
	direction: TableDirection,
	index: number,
	hasNumberedColumns: boolean,
	isDragAndDropEnabled: boolean,
	tableContainer: HTMLElement | null,
): Partial<PopupProps> {
	switch (direction) {
		case 'column':
			return getColumnOptions(index, tableContainer, hasNumberedColumns, isDragAndDropEnabled);
		case 'row':
			return getRowOptions(index, isDragAndDropEnabled);
		default:
			return {};
	}
}

export default getPopupOptions;
