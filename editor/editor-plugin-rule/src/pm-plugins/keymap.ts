import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { bindKeymapWithCommand, escape, insertRule } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { insertHorizontalRule } from './commands';

export function keymapPlugin(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): SafePlugin {
	const list = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		insertRule.common!,
		insertHorizontalRule(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
		list,
	);

	// On the top-layer path, Escape is not bound. A handled key makes ProseMirror call
	// `preventDefault()`, which claims the Escape, so no layer around the editor (for example a modal)
	// would close on it.
	if (!fg('platform-dst-top-layer')) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		bindKeymapWithCommand(escape.common!, () => true, list);
	}

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
