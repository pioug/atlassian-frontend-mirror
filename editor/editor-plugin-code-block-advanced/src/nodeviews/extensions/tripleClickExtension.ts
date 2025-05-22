import { EditorSelection } from '@codemirror/state';
import { EditorView as CodeMirror } from '@codemirror/view';

/**
 * To have consistent behaviour with previous code block when a triple click occurs in the editor
 * we should select the entire code block rather than the line.
 *
 * @returns CodeMirror extension
 */
export const tripleClickSelectAllExtension = () =>
	CodeMirror.mouseSelectionStyle.of((view, event) => {
		// Check for a triple-click and avoid non-main "button" events
		// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
		// https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
		if (event.detail !== 3 || event.button !== 0) {
			return null;
		}
		return {
			// Select the entire document
			get() {
				return EditorSelection.single(0, view.state.doc.length);
			},
			update() {},
		};
	});
