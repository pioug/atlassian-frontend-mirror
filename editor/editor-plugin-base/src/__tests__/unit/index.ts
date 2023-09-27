import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

describe('Delete', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editorFactory = (doc: DocBuilder) =>
    createEditor({
      doc,
    });

  it(`should merge paragraph and preserve content`, () => {
    const { editorView } = editorFactory(doc(p('Hello{<>}'), p('World')));

    sendKeyToPm(editorView, 'Delete');

    const expectedDoc = doc(p('Hello{<>}World'));
    expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
  });
});
