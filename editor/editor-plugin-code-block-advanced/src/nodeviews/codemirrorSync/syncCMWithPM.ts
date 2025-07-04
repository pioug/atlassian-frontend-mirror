import { type ViewUpdate } from '@codemirror/view';

import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

interface Props {
	view: EditorView;
	update: ViewUpdate;
	offset: number;
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
	const { main } = update.state.selection;
	const selFrom = offset + main.from;
	const selTo = offset + main.to;

	const pmSel = view.state.selection;
	if (update.docChanged || pmSel.from !== selFrom || pmSel.to !== selTo) {
		const tr = view.state.tr;
		update.changes.iterChanges((fromA, toA, fromB, toB, text) => {
			if (text.length) {
				tr.replaceWith(offset + fromA, offset + toA, view.state.schema.text(text.toString()));
			} else {
				tr.delete(offset + fromA, offset + toA);
			}
			offset += toB - fromB - (toA - fromA);
		});
		tr.setSelection(TextSelection.create(tr.doc, selFrom, selTo)).setMeta('scrollIntoView', false);
		view.dispatch(tr);
	}
};
