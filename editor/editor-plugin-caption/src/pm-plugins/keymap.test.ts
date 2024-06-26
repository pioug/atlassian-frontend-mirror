import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import type { RefsNode } from '@atlaskit/editor-common/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	caption,
	doc,
	media,
	mediaSingle,
	p,
	panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { sendKeyToPm } from '@atlaskit/editor-test-helpers/send-key-to-pm';

const createEditorTestingLibrary = createEditorFactory();
const editor = (doc: (schema: Schema<string, string>) => RefsNode) =>
	createEditorTestingLibrary({
		doc,
		editorProps: {
			allowPanel: true,
			media: { allowMediaSingle: true, allowCaptions: true },
		},
	});

describe('caption keymap', () => {
	it('should go to caption on tab', () => {
		const { editorView } = editor(
			doc(
				'{<node>}',
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('Hello'),
				),
			),
		);
		sendKeyToPm(editorView, 'Tab');
		const captionParentNode = findParentNodeOfType(editorView.state.schema.nodes.caption)(
			editorView.state.selection,
		);
		expect(editorView.state.selection instanceof TextSelection).toBe(true);
		expect(captionParentNode).toBeDefined();
	});

	it('should select caption on arrow down', () => {
		const { editorView } = editor(
			doc(
				'{<node>}',
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('Hello'),
				),
				p(''),
			),
		);
		sendKeyToPm(editorView, 'ArrowDown');
		const captionParentNode = findParentNodeOfType(editorView.state.schema.nodes.caption)(
			editorView.state.selection,
		);
		expect(editorView.state.selection instanceof TextSelection).toBe(true);
		expect(captionParentNode).toBeDefined();
	});

	it('should select media from caption on arrow up', () => {
		const { editorView } = editor(
			doc(
				mediaSingle({
					layout: 'center',
				})(
					media({
						id: 'abc',
						type: 'file',
						collection: 'xyz',
					})(),
					caption('he{<>}llo'),
				),
				p('something'),
			),
		);

		sendKeyToPm(editorView, 'ArrowUp');
		expect(editorView.state.selection instanceof NodeSelection).toBe(true);
		expect(editorView.state.selection.from).toBe(0);
	});

	it('should select media from caption on shift + tab', () => {
		const { editorView } = editor(
			doc(
				mediaSingle({
					layout: 'center',
				})(
					media({
						id: 'abc',
						type: 'file',
						collection: 'xyz',
					})(),
					caption('he{<>}llo'),
				),
				p('something'),
			),
		);

		sendKeyToPm(editorView, 'Shift-Tab');
		expect(editorView.state.selection instanceof NodeSelection).toBe(true);
		expect(editorView.state.selection.from).toBe(0);
	});

	it('should create paragraph below caption on arrow down if its the last node in the document', () => {
		const { editorView } = editor(
			doc(
				mediaSingle({
					layout: 'center',
				})(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('hello{<>}'),
				),
			),
		);

		sendKeyToPm(editorView, 'ArrowDown');
		expect(editorView.state).toEqualDocumentAndSelection(
			doc(
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('hello'),
				),
				p('{<>}'),
			),
		);
	});

	it('should NOT create paragraph below caption on arrow down if its followed by another node', () => {
		const { editorView } = editor(
			doc(
				mediaSingle({
					layout: 'center',
				})(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('hello{<>}'),
				),
				p('world'),
			),
		);

		sendKeyToPm(editorView, 'ArrowDown');
		expect(editorView.state).toEqualDocumentAndSelection(
			doc(
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('hello'),
				),
				p('{<>}world'),
			),
		);
	});

	it('should create paragraph below caption on enter', () => {
		const { editorView } = editor(
			doc(
				mediaSingle({
					layout: 'center',
				})(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('hello{<>}'),
				),
			),
		);

		sendKeyToPm(editorView, 'Enter');
		expect(editorView.state.doc).toEqualDocument(
			doc(
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('hello'),
				),
				p(),
			),
		);
	});

	it('should not create paragraph below panel on enter', () => {
		const { editorView } = editor(doc(panel()(p('text{<>}'))));
		sendKeyToPm(editorView, 'Enter');
		expect(editorView.state.doc).toEqualDocument(doc(panel()(p('text'), p())));
	});

	it('should move to paragraph below caption on arrow down', () => {
		const { editorView } = editor(
			doc(
				mediaSingle({
					layout: 'center',
				})(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('hel{<>}lo'),
				),
				p('something'),
			),
		);

		sendKeyToPm(editorView, 'ArrowDown');
		expect(editorView.state).toEqualDocumentAndSelection(
			doc(
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('hello'),
				),
				p('{<>}something'),
			),
		);
	});

	it('should move to paragraph below caption on enter', () => {
		const { editorView } = editor(
			doc(
				mediaSingle({
					layout: 'center',
				})(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('he{<>}llo'),
				),
				p('something'),
			),
		);

		sendKeyToPm(editorView, 'Enter');
		expect(editorView.state).toEqualDocumentAndSelection(
			doc(
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('hello'),
				),
				p('{<>}something'),
			),
		);
	});

	it('should gap cursor parent media single on left arrow', () => {
		const { editorView } = editor(
			doc(
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('{<>}Hello'),
				),
				p(''),
			),
		);
		sendKeyToPm(editorView, 'ArrowLeft');
		expect(editorView.state.selection).toBeInstanceOf(GapCursorSelection);
		expect(editorView.state).toEqualDocumentAndSelection(
			doc(
				'{<gap|>}',
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('Hello'),
				),
				p(''),
			),
		);
	});

	it('should not gap cursor parent media single on left arrow when not at start', () => {
		const { editorView } = editor(
			doc(
				mediaSingle()(
					media({
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
					})(),
					caption('H{<>}ello'),
				),
				p(''),
			),
		);
		sendKeyToPm(editorView, 'ArrowLeft');
		expect(editorView.state.selection).not.toBeInstanceOf(GapCursorSelection);
	});
});
