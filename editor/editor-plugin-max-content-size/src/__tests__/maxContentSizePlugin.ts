import { Schema } from '@atlaskit/editor-prosemirror/model';
import { EditorState, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { createPlugin } from '../maxContentSizePlugin';

const schema = new Schema({
	nodes: {
		doc: { content: 'paragraph+' },
		paragraph: { content: 'text*', toDOM: () => ['p', 0] },
		text: {},
	},
});

// A doc holding a single paragraph of `text` has a nodeSize of text.length + 4.
const createEditorState = (text: string, maxContentSize: number) =>
	EditorState.create({
		schema,
		doc: schema.node('doc', undefined, schema.node('paragraph', undefined, schema.text(text))),
		plugins: [createPlugin(jest.fn(), maxContentSize)!],
	});

describe('maxContentSizePlugin', () => {
	it('blocks a transaction that takes the document over the limit', () => {
		const state = createEditorState('abc', 8);

		const { state: nextState } = state.applyTransaction(state.tr.insertText('de', 1));

		expect(nextState.doc.textContent).toEqual('abc');
	});

	it('allows a transaction that keeps the document within the limit', () => {
		const state = createEditorState('abc', 10);

		const { state: nextState } = state.applyTransaction(state.tr.insertText('d', 1));

		expect(nextState.doc.textContent).toEqual('dabc');
	});

	// A document can load already over the limit — it must still be editable back under it.
	describe('when the document is already over the limit', () => {
		const experiment = 'platform_editor_max_content_size_allow_delete';

		it('allows a deletion that leaves the document over the limit', () => {
			mockExpEnabled(experiment);
			const state = createEditorState('abcdefghij', 8);

			const { state: nextState } = state.applyTransaction(state.tr.delete(1, 2));

			expect(nextState.doc.textContent).toEqual('bcdefghij');
		});

		it('allows the selection to move', () => {
			mockExpEnabled(experiment);
			const state = createEditorState('abcdefghij', 8);
			const tr = state.tr.setSelection(TextSelection.create(state.doc, 4));

			const { state: nextState } = state.applyTransaction(tr);

			expect(nextState.selection.from).toEqual(4);
		});

		it('still blocks an insertion', () => {
			mockExpEnabled(experiment);
			const state = createEditorState('abcdefghij', 8);

			const { state: nextState } = state.applyTransaction(state.tr.insertText('k', 1));

			expect(nextState.doc.textContent).toEqual('abcdefghij');
		});

		it('blocks a deletion when the experiment is off', () => {
			mockExpDisabled(experiment);
			const state = createEditorState('abcdefghij', 8);

			const { state: nextState } = state.applyTransaction(state.tr.delete(1, 2));

			expect(nextState.doc.textContent).toEqual('abcdefghij');
		});
	});
});
