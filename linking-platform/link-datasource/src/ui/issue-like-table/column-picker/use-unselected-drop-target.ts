import { type RefObject, useEffect } from 'react';

import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';

import { useColumnPickerInstanceId } from './column-picker-instance';
import {
	COLUMN_PICKER_DRAG_TYPE,
	type ColumnPickerDropZone,
	isColumnPickerDragDataFor,
} from './drag-data';

const UNSELECTED_ZONE: ColumnPickerDropZone = 'unselected';

/**
 * Registers `ref` as a drop target that unselects the dragged column.
 */
export const useUnselectedDropTarget = (ref: RefObject<HTMLElement>): void => {
	const pickerId = useColumnPickerInstanceId();

	useEffect(() => {
		const element = ref.current;
		if (!element || !pickerId) {
			return;
		}

		return dropTargetForElements({
			element,
			canDrop: ({ source }) => isColumnPickerDragDataFor(source.data, pickerId),
			getData: () => ({ type: COLUMN_PICKER_DRAG_TYPE, zone: UNSELECTED_ZONE, pickerId }),
		});
	}, [ref, pickerId]);
};
