import { EditorState as CodeMirrorState } from '@codemirror/state';
import type { Extension } from '@codemirror/state';

/**
 * To avoid issues with CRLF (\r\n) syncing with ProseMirror,
 * we only consider \n for line separators.
 */
export const lineSeparatorExtension = (): Extension => {
	return CodeMirrorState.lineSeparator.of('\n');
};
