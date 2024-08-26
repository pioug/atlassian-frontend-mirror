import { type IntlShape } from 'react-intl-next/src/types';

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
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import {
	arrowLeftFromTable,
	arrowRightFromTable,
	modASelectTable,
	selectColumns,
	selectRows,
	shiftArrowUpFromTable,
} from '../commands/selection';
import { type PluginInjectionAPI } from '../types';

export function tableSelectionKeymapPlugin(
	pluginInjectionApi?: PluginInjectionAPI,
	getIntl?: () => IntlShape,
): SafePlugin {
	const list = {};
	const editorSelectionAPI = pluginInjectionApi?.selection;
	const ariaNotifyPlugin = pluginInjectionApi?.accessibilityUtils?.actions.ariaNotify;

	bindKeymapWithCommand(moveRight.common!, arrowRightFromTable(editorSelectionAPI)(), list);

	bindKeymapWithCommand(moveLeft.common!, arrowLeftFromTable(editorSelectionAPI)(), list);

	bindKeymapArrayWithCommand(
		selectColumn,
		selectColumns(editorSelectionAPI, ariaNotifyPlugin, getIntl)(true),
		list,
	);

	bindKeymapArrayWithCommand(
		selectRow,
		selectRows(editorSelectionAPI, ariaNotifyPlugin, getIntl)(true),
		list,
	);

	bindKeymapWithCommand(shiftArrowUp.common!, shiftArrowUpFromTable(editorSelectionAPI)(), list);

	bindKeymapWithCommand(selectTable.common!, modASelectTable(editorSelectionAPI)(), list);

	return keymap(list) as SafePlugin;
}
