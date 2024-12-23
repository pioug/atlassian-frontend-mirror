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

import { type PluginInjectionAPI } from '../types';

import {
	arrowLeftFromTable,
	arrowRightFromTable,
	modASelectTable,
	selectColumns,
	selectRows,
	shiftArrowUpFromTable,
} from './commands/selection';

export function tableSelectionKeymapPlugin(
	pluginInjectionApi?: PluginInjectionAPI,
	getIntl?: () => IntlShape,
): SafePlugin {
	const list = {};
	const editorSelectionAPI = pluginInjectionApi?.selection;
	const ariaNotifyPlugin = pluginInjectionApi?.accessibilityUtils?.actions.ariaNotify;

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(moveRight.common!, arrowRightFromTable(editorSelectionAPI)(), list);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(shiftArrowUp.common!, shiftArrowUpFromTable(editorSelectionAPI)(), list);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(selectTable.common!, modASelectTable(editorSelectionAPI)(), list);

	return keymap(list) as SafePlugin;
}
