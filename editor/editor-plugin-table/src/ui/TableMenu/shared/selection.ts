import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import {
	findCellRectClosestToPos,
	getSelectionRect,
	isSelectionType,
} from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * Resolve the table `Rect` for the current selection. Falls back to the closest cell's rect
 * for a `TextSelection` (cell menu), where `getSelectionRect` returns `undefined`. Gated:
 * with the gate off this behaves exactly like `getSelectionRect`.
 */
export const getMenuSelectionRect = (selection: Selection): Rect | undefined => {
	if (!fg('platform_editor_table_cell_menu_update')) {
		return getSelectionRect(selection);
	}

	return isSelectionType(selection, 'cell')
		? getSelectionRect(selection)
		: findCellRectClosestToPos(selection.$from);
};
