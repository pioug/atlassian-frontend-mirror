import type { Extension } from '@codemirror/state';
import { EditorView as CodeMirror } from '@codemirror/view';

/**
 * Keeps 'first-node-in-document' class if it was added to a codeBlock by
 * platform/packages/editor/editor-plugin-block-controls/src/pm-plugins/first-node-dec-plugin.ts
 *
 * @param getPos
 * @returns CodeMirror Extension
 * @example
 */
export const firstCodeBlockInDocument = (getPos: () => number | undefined): Extension => {
	return CodeMirror.editorAttributes.of({
		class: getPos?.() === 0 ? 'first-node-in-document' : '',
	});
};
