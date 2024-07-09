import {
	bindKeymapArrayWithCommand,
	bindKeymapWithCommand,
	moveLeft,
	moveRight,
	selectColumn,
	selectRow,
	selectTable,
	shiftArrowUp,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import {
	arrowLeftFromTable,
	arrowRightFromTable,
	modASelectTable,
	selectColumns,
	selectRows,
	shiftArrowUpFromTable,
} from '../commands/selection';
import type tablePlugin from '../plugin';

export function tableSelectionKeymapPlugin(
	editorSelectionAPI: ExtractInjectionAPI<typeof tablePlugin>['selection'] | undefined,
): SafePlugin {
	const list = {};

	bindKeymapWithCommand(moveRight.common!, arrowRightFromTable(editorSelectionAPI)(), list);

	bindKeymapWithCommand(moveLeft.common!, arrowLeftFromTable(editorSelectionAPI)(), list);

	bindKeymapArrayWithCommand(selectColumn, selectColumns(editorSelectionAPI)(true), list);

	bindKeymapArrayWithCommand(selectRow, selectRows(editorSelectionAPI)(true), list);

	bindKeymapWithCommand(shiftArrowUp.common!, shiftArrowUpFromTable(editorSelectionAPI)(), list);

	bindKeymapWithCommand(selectTable.common!, modASelectTable(editorSelectionAPI)(), list);

	return keymap(list) as SafePlugin;
}

export default tableSelectionKeymapPlugin;
