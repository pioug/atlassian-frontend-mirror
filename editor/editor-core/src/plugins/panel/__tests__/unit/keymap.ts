import {
  doc,
  p,
  panel,
  DocBuilder,
  blockquote,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

describe('panel plugin -> keymap', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        allowPanel: true,
        allowRule: true,
        allowLayouts: true,
        allowNewInsertionBehaviour: true,
        quickInsert: true,
        media: {
          allowMediaSingle: true,
        },
      },
    });
  };

  it('should not merge two panels, when entering backspace in an empty panel', () => {
    const { editorView } = editor(
      doc(panel({ panelType: 'info' })(p()), panel({ panelType: 'info' })(p())),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(panel({ panelType: 'info' })(p())),
    );
  });

  it('should not merge two quotes, when entering backspace in an empty panel', () => {
    const { editorView } = editor(doc(blockquote(p()), blockquote(p())));

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
  });

  it('should not merge blockquote and panel, when entering backspace in an empty panel', () => {
    const { editorView } = editor(
      doc(blockquote(p()), panel({ panelType: 'info' })(p())),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
  });

  it('should not merge panel and blockquote, when entering backspace in an empty blockquote', () => {
    const { editorView } = editor(
      doc(panel({ panelType: 'info' })(p()), blockquote(p())),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(panel({ panelType: 'info' })(p())),
    );
  });
});
