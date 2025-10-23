import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	bindKeymapWithEditorCommand,
	clearFormatting,
	findShortcutByKeymap,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { clearFormattingWithAnalyticsNext } from '../editor-commands/clear-formatting';

export function keymapPlugin(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): SafePlugin {
	const list = {};
	bindKeymapWithEditorCommand(
		expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
			? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				findShortcutByKeymap(clearFormatting)!
			: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				clearFormatting.common!,
		clearFormattingWithAnalyticsNext(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
		list,
	);

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
