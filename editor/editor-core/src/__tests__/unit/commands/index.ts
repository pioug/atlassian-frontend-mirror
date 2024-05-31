import { clearEditorContent } from '@atlaskit/editor-common/commands';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

describe('commands', () => {
	const createEditor = (doc: DocBuilder) =>
		createEditorFactory()({
			doc,
		});

	describe('clearEditorContent', () => {
		it('clears editor content', () => {
			const { editorView } = createEditor(doc(p('text{<>}')));
			clearEditorContent(editorView.state, editorView.dispatch);
			expect(editorView.state.doc).toEqualDocument(doc(p()));
		});
	});
});
