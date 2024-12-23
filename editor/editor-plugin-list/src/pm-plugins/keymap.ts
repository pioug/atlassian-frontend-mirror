import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	backspace,
	bindKeymapWithCommand,
	bindKeymapWithEditorCommand,
	deleteKey,
	enter,
	findKeyMapForBrowser,
	findShortcutByKeymap,
	forwardDelete,
	indentList,
	outdentList,
	toggleBulletList,
	toggleOrderedList,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { backspaceKeyCommand, deleteKeyCommand, enterKeyCommand, toggleList } from './commands';
import { indentList as indentListCommand } from './commands/indent-list';
import { outdentList as outdentListCommand } from './commands/outdent-list';

export function keymapPlugin(
	featureFlags: FeatureFlags,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin | undefined {
	const list = {};

	bindKeymapWithEditorCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		findShortcutByKeymap(toggleOrderedList)!,
		toggleList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, 'orderedList'),
		list,
	);
	bindKeymapWithEditorCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		findShortcutByKeymap(toggleBulletList)!,
		toggleList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, 'bulletList'),
		list,
	);
	bindKeymapWithEditorCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		indentList.common!,
		indentListCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD),
		list,
	);
	bindKeymapWithEditorCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		outdentList.common!,
		outdentListCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD),
		list,
	);
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(enter.common!, enterKeyCommand(editorAnalyticsAPI)(), list);
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(backspace.common!, backspaceKeyCommand(editorAnalyticsAPI)(), list);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	bindKeymapWithCommand(deleteKey.common!, deleteKeyCommand(editorAnalyticsAPI), list);

	// This shortcut is Mac only
	bindKeymapWithCommand(
		findKeyMapForBrowser(forwardDelete) as string,
		deleteKeyCommand(editorAnalyticsAPI),
		list,
	);

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
