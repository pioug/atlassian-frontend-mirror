import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { Rect } from '@atlaskit/editor-tables/rect';
import { findCellRectClosestToPos } from '@atlaskit/editor-tables/utils';
import { getSelectionRect } from '@atlaskit/editor-tables/utils/get-selection-rect';
import { isSelectionType } from '@atlaskit/editor-tables/utils/is-selection-type';

/**
 * Resolve the table `Rect` for the current selection. Falls back to the closest cell's rect
 * for a `TextSelection` (cell menu), where `getSelectionRect` returns `undefined`.
 */
export const getMenuSelectionRect = (selection: Selection): Rect | undefined =>
	isSelectionType(selection, 'cell')
		? getSelectionRect(selection)
		: findCellRectClosestToPos(selection.$from);
