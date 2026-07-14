import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * Returns the total number of DOM elements inside the editor's content DOM,
 * used as a proxy for document complexity in performance events.
 *
 * Uses the native `getElementsByTagName('*')`, which counts descendants
 * iteratively in the browser engine — intentionally not a recursive JS walk, so
 * it can't overflow the stack on very large documents.
 */
export function getEditorDomSize(view: EditorView): number {
	return view.dom.getElementsByTagName('*').length;
}
