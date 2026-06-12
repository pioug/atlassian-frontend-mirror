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
		insertLayoutColumn(
			{ side: 'left', inputMethod: INPUT_METHOD.SHORTCUT },
			api?.analytics?.actions,
			api,
		),
		list,
	);
	bindLayoutColumnShortcut(
		addColumnBeforeVO.common,
		insertLayoutColumn(
			{ side: 'left', inputMethod: INPUT_METHOD.SHORTCUT },
			api?.analytics?.actions,
			api,
		),
		list,
	);
	bindLayoutColumnShortcut(
		addColumnAfter.common,
		insertLayoutColumn(
			{ side: 'right', inputMethod: INPUT_METHOD.SHORTCUT },
			api?.analytics?.actions,
			api,
		),
		list,
	);
	bindLayoutColumnShortcut(
		addColumnAfterVO.common,
		insertLayoutColumn(
			{ side: 'right', inputMethod: INPUT_METHOD.SHORTCUT },
			api?.analytics?.actions,
			api,
		),
		list,
	);
	bindLayoutColumnShortcut(
		deleteColumn.common,
		deleteLayoutColumn({ inputMethod: INPUT_METHOD.SHORTCUT }, api?.analytics?.actions, api),
		list,
	);

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
