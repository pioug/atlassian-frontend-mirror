import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { addInlineComment, bindKeymapWithCommand } from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { setInlineCommentDraftState } from '../commands';

export function keymapPlugin(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): SafePlugin {
	const list = {};

	bindKeymapWithCommand(
		addInlineComment.common!,
		setInlineCommentDraftState(editorAnalyticsAPI)(true, INPUT_METHOD.SHORTCUT),
		list,
	);

	return keymap(list) as SafePlugin;
}
