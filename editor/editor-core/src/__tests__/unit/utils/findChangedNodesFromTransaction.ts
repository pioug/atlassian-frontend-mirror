import type { RefsNode } from '@atlaskit/editor-common/types';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
	doc,
	expand,
	media,
	mediaGroup,
	p,
	table,
	td,
	tdEmpty,
	tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { Schema } from '@atlaskit/editor-test-helpers/schema';

import { findChangedNodesFromTransaction } from '../../../utils/findChangedNodesFromTransaction';

const createEditor = createEditorFactory();
const editor = (doc: (schema: Schema<any, any>) => RefsNode) =>
	createEditor({
		doc,
		editorProps: {
			allowTables: true,
			allowExpand: true,
			media: {
				allowMediaSingle: true,
				allowMediaGroup: true,
			},
		},
	});

describe('findChangedNodesFromTransaction', () => {
	it('should only find top level nodes which changed in the transaction for replace', () => {
		const { editorView } = editor(doc(p('')));

		const { state } = editorView;
		const transaction = state.tr.replaceWith(
			0,
			state.doc.content.size,
			doc(
				p('Hello'),
				expand()(
					p('World!'),
					table({ localId: 'test-inner' })(
						tr(tdEmpty, tdEmpty, tdEmpty),
						tr(tdEmpty, tdEmpty, tdEmpty),
						tr(tdEmpty, tdEmpty, tdEmpty),
					),
				),
				table({ localId: 'test-outer' })(
					tr(tdEmpty, tdEmpty, tdEmpty),
					tr(tdEmpty, tdEmpty, tdEmpty),
					tr(tdEmpty, tdEmpty, td()(p('test'))),
				),
			)(state.schema),
		);

		const nodes = findChangedNodesFromTransaction(transaction);

		expect(nodes).toHaveLength(3);
		expect(nodes[0].type).toEqual(state.schema.nodes.paragraph);
		expect(nodes[1].type).toEqual(state.schema.nodes.expand);
		expect(nodes[2].type).toEqual(state.schema.nodes.table);
		expect(nodes[2].attrs.localId).toEqual('test-outer');
	});

	it('should only find the top level nodes of inserted content from the transaction', () => {
		const { editorView } = editor(
			doc(
				p('Hello'),
				expand()(
					p('World!'),
					table({ localId: 'test-inner' })(
						tr(tdEmpty, tdEmpty, tdEmpty),
						tr(tdEmpty, tdEmpty, tdEmpty),
						tr(tdEmpty, tdEmpty, tdEmpty),
					),
				),
			),
		);

		const { state } = editorView;
		const transaction = state.tr.insert(
			state.doc.content.size,
			table({ localId: 'test-outer' })(
				tr(tdEmpty, tdEmpty, tdEmpty),
				tr(tdEmpty, tdEmpty, tdEmpty),
				tr(tdEmpty, tdEmpty, td()(p('test'))),
			)(state.schema),
		);

		const nodes = findChangedNodesFromTransaction(transaction);

		expect(nodes).toHaveLength(1);
		expect(nodes[0].type).toEqual(state.schema.nodes.table);
		expect(nodes[0].attrs.localId).toEqual('test-outer');
	});

	it('should only find top level nodes which changed in the transaction for replace and insert', () => {
		const { editorView } = editor(
			doc(
				p('Hello'),
				p('World{<>}'),
				expand()(
					p('World!'),
					table({ localId: 'test-inner' })(
						tr(tdEmpty, tdEmpty, tdEmpty),
						tr(tdEmpty, tdEmpty, tdEmpty),
						tr(tdEmpty, tdEmpty, tdEmpty),
					),
				),
			),
		);

		const { state } = editorView;
		const transaction = state.tr
			.insert(0, p('top')(state.schema))
			.replaceSelectionWith(table({ localId: 'test-outer' })(tr(tdEmpty))(state.schema));

		const nodes = findChangedNodesFromTransaction(transaction);

		expect(nodes).toHaveLength(2);
		expect(nodes[0].type).toEqual(state.schema.nodes.paragraph);
		expect(nodes[0].textContent).toEqual('top');

		expect(nodes[1].type).toEqual(state.schema.nodes.table);
		expect(nodes[1].attrs.localId).toEqual('test-outer');
	});

	it('should not error and find top level nodes when the replace step goes outside the final document bound size', () => {
		const { editorView } = editor(doc(p('{<>}')));

		const { state } = editorView;

		// This is creating a scenario where the first replace step exceed the bounds of the doc which could cause
		// the nodeBetween search to fail because it doesn't clamp it's seek loop to the max doc position
		const transaction = state.tr
			.replace(
				2,
				2,
				new Slice(
					Fragment.from([
						mediaGroup(
							media({
								__contextId: expect.any(String),
								id: expect.any(String),
								collection: 'MediaServicesSample',
								type: 'file',
							})(),
						)(state.schema),
						p('')(state.schema),
					]),
					0,
					0,
				),
			)
			.replace(0, 2, new Slice(Fragment.empty, 0, 0));

		const nodes = findChangedNodesFromTransaction(transaction);

		expect(nodes).toHaveLength(2);
		expect(nodes[0].type).toEqual(state.schema.nodes.mediaGroup);
		expect(nodes[1].type).toEqual(state.schema.nodes.paragraph);
	});
});
