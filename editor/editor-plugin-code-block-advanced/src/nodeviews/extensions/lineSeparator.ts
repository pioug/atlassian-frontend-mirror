import { EditorState as CodeMirrorState, type Extension } from '@codemirror/state';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * To avoid issues with CRLF (\r\n) syncing with ProseMirror,
 * we only consider \n for line separators.
 */
export const lineSeparatorExtension = (): Extension => {
	if (expValEquals('platform_editor_fix_advanced_codeblocks_crlf', 'isEnabled', true)) {
		return CodeMirrorState.lineSeparator.of('\n');
	}
	return [];
};
