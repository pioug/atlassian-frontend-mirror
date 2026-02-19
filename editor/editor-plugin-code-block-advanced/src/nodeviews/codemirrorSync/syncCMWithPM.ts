import { type ViewUpdate } from '@codemirror/view';

import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

interface Props {
	offset: number;
	update: ViewUpdate;
	view: EditorView;
}

/**
 * Returns the extra offset to add when mapping a CodeMirror position to ProseMirror
 * when the content may contain \r\n (CRLF). Each \r\n in the text before the given
 * position counts as one extra character in PM.
 */
function crlfAdjustment(text: string, cmPos: number): number {
	let cmIdx = 0;
	let pmIdx = 0;
	while (pmIdx < text.length && cmIdx < cmPos) {
		if (text[pmIdx] === '\r' && text[pmIdx + 1] === '\n') {
			pmIdx++;
		}
		pmIdx++;
		cmIdx++;
	}
	return pmIdx - cmIdx;
}

/**
 *
 * Synchronises the CodeMirror update changes with the Prosemirror editor
 *
 * @param props.view EditorView - Prosemirror EditorView
 * @param props.update ViewUpdate - CodeMirror ViewUpdate
 * @param props.offset number - position where the code block starts in prosemirror
 */
export const syncCMWithPM = ({ view, update, offset }: Props): void => {
	const codeBlockText = view.state.doc.nodeAt(offset)?.textContent ?? '';
	const { main } = update.state.selection;
	const selFrom = offset + main.from;
	const selTo = offset + main.to;

	const pmSel = view.state.selection;
	if (update.docChanged || pmSel.from !== selFrom || pmSel.to !== selTo) {
		const tr = view.state.tr;
		update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
			if (expValEquals('platform_editor_fix_advanced_codeblocks_crlf_patch', 'isEnabled', true)) {
				const adjFrom = crlfAdjustment(codeBlockText, fromA);
				// If the from and to are the same, we don't need to run adjustment again
				const adjTo = fromA === toA ? adjFrom : crlfAdjustment(codeBlockText, toA);
				const pmFrom = offset + fromA + adjFrom;
				const pmTo = offset + toA + adjTo;
				if (text.length) {
					tr.replaceWith(pmFrom, pmTo, view.state.schema.text(text.toString()));
				} else {
					tr.delete(pmFrom, pmTo);
				}
			} else {
				if (text.length) {
					tr.replaceWith(offset + fromA, offset + toA, view.state.schema.text(text.toString()));
				} else {
					tr.delete(offset + fromA, offset + toA);
				}
			}
			offset += toB - fromB - (toA - fromA);
		});
		tr.setSelection(TextSelection.create(tr.doc, selFrom, selTo)).setMeta('scrollIntoView', false);
		view.dispatch(tr);
	}
};
