import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { bindKeymapWithCommand, clearFormatting } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { clearFormattingWithAnalytics } from '../editor-commands/clear-formatting';

export function keymapPlugin(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): SafePlugin {
	const list = {};
	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		clearFormatting.common!,
		clearFormattingWithAnalytics(INPUT_METHOD.SHORTCUT, editorAnalyticsAPI),
		list,
	);

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
