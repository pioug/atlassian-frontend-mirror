import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	addColumnAfter,
	addColumnAfterVO,
	addColumnBefore,
	addColumnBeforeVO,
	bindKeymapWithEditorCommand,
	deleteColumn,
	keymap,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { LayoutPlugin } from '../layoutPluginType';

import { deleteLayoutColumn, insertLayoutColumn } from './actions';

type Shortcut = string | undefined;
type KeymapBindings = Parameters<typeof bindKeymapWithEditorCommand>[2];

const bindLayoutColumnShortcut = (
	shortcut: Shortcut,
	command: ReturnType<typeof insertLayoutColumn> | ReturnType<typeof deleteLayoutColumn>,
	list: KeymapBindings,
) => {
	if (!shortcut) {
		return;
	}

	bindKeymapWithEditorCommand(shortcut, command, list);
};

/**
 * Creates shortcut handlers for layout column actions.
 */
function keymapPlugin({ api }: { api: ExtractInjectionAPI<LayoutPlugin> | undefined }): SafePlugin {
	const list = {};

	bindLayoutColumnShortcut(
		addColumnBefore.common,
		insertLayoutColumn('left', api?.analytics?.actions, api, INPUT_METHOD.KEYBOARD),
		list,
	);
	bindLayoutColumnShortcut(
		addColumnBeforeVO.common,
		insertLayoutColumn('left', api?.analytics?.actions, api, INPUT_METHOD.KEYBOARD),
		list,
	);
	bindLayoutColumnShortcut(
		addColumnAfter.common,
		insertLayoutColumn('right', api?.analytics?.actions, api, INPUT_METHOD.KEYBOARD),
		list,
	);
	bindLayoutColumnShortcut(
		addColumnAfterVO.common,
		insertLayoutColumn('right', api?.analytics?.actions, api, INPUT_METHOD.KEYBOARD),
		list,
	);
	bindLayoutColumnShortcut(
		deleteColumn.common,
		deleteLayoutColumn(api?.analytics?.actions, api, INPUT_METHOD.KEYBOARD),
		list,
	);

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
