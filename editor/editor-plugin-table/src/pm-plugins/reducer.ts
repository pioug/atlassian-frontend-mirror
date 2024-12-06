import type { TablePluginAction, TablePluginState } from '../types';

import { defaultTableSelection } from './default-table-selection';

export default (pluginState: TablePluginState, action: TablePluginAction): TablePluginState => {
	switch (action.type) {
		case 'TOGGLE_HEADER_COLUMN':
			return {
				...pluginState,
				isHeaderColumnEnabled: !pluginState.isHeaderColumnEnabled,
			};

		case 'TOGGLE_HEADER_ROW':
			return {
				...pluginState,
				isHeaderRowEnabled: !pluginState.isHeaderRowEnabled,
			};

		case 'CLEAR_HOVER_SELECTION':
			return { ...pluginState, ...action.data, ...defaultTableSelection };

		case 'SELECT_COLUMN':
			return { ...pluginState, ...action.data, isContextualMenuOpen: false };

		case 'SET_TARGET_CELL_POSITION':
			return { ...pluginState, ...action.data, isContextualMenuOpen: false };

		case 'TOGGLE_CONTEXTUAL_MENU':
			return {
				...pluginState,
				isContextualMenuOpen: !pluginState.isContextualMenuOpen,
			};

		case 'SHOW_INSERT_ROW_BUTTON':
			if (action.data.insertRowButtonIndex === pluginState.insertRowButtonIndex) {
				return pluginState;
			}

			return {
				...pluginState,
				...action.data,
				insertColumnButtonIndex: undefined, // We need to assure that column is not shown
			};

		case 'SHOW_INSERT_COLUMN_BUTTON':
			if (action.data.insertColumnButtonIndex === pluginState.insertColumnButtonIndex) {
				return pluginState;
			}
			return {
				...pluginState,
				...action.data,
				insertRowButtonIndex: undefined, // We need to assure that row is not shown
			};

		case 'HIDE_INSERT_COLUMN_OR_ROW_BUTTON':
			if (
				pluginState.insertRowButtonIndex !== undefined ||
				pluginState.insertColumnButtonIndex !== undefined
			) {
				return {
					...pluginState,
					insertRowButtonIndex: undefined,
					insertColumnButtonIndex: undefined,
				};
			}
			return pluginState;

		case 'HIDE_RESIZE_HANDLE_LINE':
			return {
				...pluginState,
				...action.data,
				resizeHandleColumnIndex: undefined,
				resizeHandleRowIndex: undefined,
			};
		case 'START_KEYBOARD_COLUMN_RESIZE':
		case 'ADD_RESIZE_HANDLE_DECORATIONS':
			if (
				action.data.resizeHandleColumnIndex === pluginState.resizeHandleColumnIndex &&
				action.data.resizeHandleRowIndex === pluginState.resizeHandleRowIndex &&
				action.data.resizeHandleIncludeTooltip === pluginState.resizeHandleIncludeTooltip &&
				action.data.isKeyboardResize === pluginState.isKeyboardResize
			) {
				return pluginState;
			}
			return {
				...pluginState,
				...action.data,
				isResizeHandleWidgetAdded: true,
			};

		case 'UPDATE_RESIZE_HANDLE_DECORATIONS':
			const { resizeHandleColumnIndex, resizeHandleRowIndex, resizeHandleIncludeTooltip } =
				action.data;

			if (
				(resizeHandleColumnIndex === pluginState.resizeHandleColumnIndex ||
					!Number.isFinite(resizeHandleColumnIndex)) &&
				(resizeHandleRowIndex === pluginState.resizeHandleRowIndex ||
					!Number.isFinite(resizeHandleRowIndex)) &&
				(resizeHandleIncludeTooltip === pluginState.resizeHandleIncludeTooltip ||
					resizeHandleIncludeTooltip === undefined)
			) {
				return pluginState;
			}

			return {
				...pluginState,
				resizeHandleColumnIndex: resizeHandleColumnIndex ?? pluginState.resizeHandleColumnIndex,
				resizeHandleRowIndex: resizeHandleRowIndex ?? pluginState.resizeHandleRowIndex,
				resizeHandleIncludeTooltip:
					resizeHandleIncludeTooltip ?? pluginState.resizeHandleIncludeTooltip,
			};

		case 'STOP_KEYBOARD_COLUMN_RESIZE':
		case 'REMOVE_RESIZE_HANDLE_DECORATIONS':
			if (!pluginState.isResizeHandleWidgetAdded) {
				return pluginState;
			}

			return {
				...pluginState,
				...action.data,
				resizeHandleColumnIndex: undefined,
				resizeHandleRowIndex: undefined,
				isResizeHandleWidgetAdded: false,
				isKeyboardResize: undefined,
			};

		case 'UPDATE_TABLE_WIDTH_TO_WIDEST':
		case 'SET_TABLE_REF':
		case 'HOVER_ROWS':
		case 'HOVER_COLUMNS':
		case 'HOVER_TABLE':
		case 'TABLE_HOVERED':
		case 'HOVER_MERGED_CELLS':
		case 'HOVER_CELL':
		case 'SHOW_RESIZE_HANDLE_LINE':
		case 'SET_EDITOR_FOCUS':
		case 'SET_CELL_MENU_OPEN':
			return { ...pluginState, ...action.data };

		default:
			return pluginState;
	}
};
