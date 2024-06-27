// #region Constants
import type { IntlShape } from 'react-intl-next/src/types';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import type { Direction } from '@atlaskit/editor-tables/types';
import { goToNextCell as baseGotoNextCell, findTable } from '@atlaskit/editor-tables/utils';

import { insertRowWithAnalytics } from '../commands-with-analytics';
import { getPluginState } from '../pm-plugins/plugin-factory';

import { stopKeyboardColumnResizing } from './column-resize';

const TAB_FORWARD_DIRECTION = 1;
const TAB_BACKWARD_DIRECTION = -1;

export const goToNextCell =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		ariaNotify?: (message: string) => void,
		getIntl?: () => IntlShape,
	) =>
	(direction: Direction): Command =>
	(state, dispatch, view) => {
		const table = findTable(state.selection);
		if (!table) {
			return false;
		}

		const isColumnResizing = getPluginState(state)?.isKeyboardResize;
		if (isColumnResizing) {
			stopKeyboardColumnResizing({
				ariaNotify: ariaNotify,
				getIntl: getIntl,
			})(state, dispatch, view);
			return true;
		}

		const map = TableMap.get(table.node);
		const { tableCell, tableHeader } = state.schema.nodes;
		const cell = findParentNodeOfType([tableCell, tableHeader])(state.selection)!;
		const firstCellPos = map.positionAt(0, 0, table.node) + table.start;
		const lastCellPos = map.positionAt(map.height - 1, map.width - 1, table.node) + table.start;

		// when tabbing backwards at first cell (top left), insert row at the start of table
		if (firstCellPos === cell.pos && direction === TAB_BACKWARD_DIRECTION) {
			insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, {
				index: 0,
				moveCursorToInsertedRow: true,
			})(state, dispatch);
			return true;
		}

		// when tabbing forwards at last cell (bottom right), insert row at the end of table
		if (lastCellPos === cell.pos && direction === TAB_FORWARD_DIRECTION) {
			insertRowWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, {
				index: map.height,
				moveCursorToInsertedRow: true,
			})(state, dispatch);
			return true;
		}

		if (dispatch) {
			return baseGotoNextCell(direction)(state, dispatch);
		}

		return true;
	};
